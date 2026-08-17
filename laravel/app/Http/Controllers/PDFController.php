<?php

namespace App\Http\Controllers;

use App\Models\PdfTool;
use App\Models\FileHistory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Http;
use setasign\Fpdi\Fpdi;
use Smalot\PdfParser\Parser;

class PDFController extends Controller
{
    /**
     * Merge multiple PDFs into a single file
     */
    public function mergePDF(Request $request)
    {
        $request->validate([
            'files' => 'required|array|min:2',
            'files.*' => 'required|mimes:pdf|max:20480', // Max 20MB file sizes
        ]);

        try {
            $pdf = new Fpdi();
            $uploadedFiles = $request->file('files');
            
            // Loop through each PDF file and copy pages sequentially
            foreach ($uploadedFiles as $file) {
                $filePath = $file->getRealPath();
                $pagesCount = $pdf->setSourceFile($filePath);
                
                for ($i = 1; $i <= $pagesCount; $i++) {
                    $templateId = $pdf->importPage($i);
                    $size = $pdf->getTemplateSize($templateId);
                    
                    $pdf->AddPage($size['orientation'], [$size['width'], $size['height']]);
                    $pdf->useTemplate($templateId);
                }
            }

            // Save finalized file to local temporary storage
            $outputName = 'Merged_' . time() . '.pdf';
            $outputPath = 'public/temp/' . $outputName;
            
            Storage::put($outputPath, $pdf->Output('S'));

            // Track usage count
            $tool = PdfTool::where('tool_id', 'merge-pdf')->first();
            if ($tool) $tool->incrementUsage();

            return response()->json([
                'success' => true,
                'download_url' => Storage::url($outputPath),
                'file_name' => $outputName
            ]);

        } catch (\Exception $e) {
            return response()->json(['success' => false, 'error' => $e->getMessage()], 500);
        }
    }

    /**
     * Split high-page counts PDF documents
     */
    public function splitPDF(Request $request)
    {
        $request->validate([
            'file' => 'required|mimes:pdf|max:15360',
            'range_start' => 'required|integer|min:1',
            'range_end' => 'required|integer|gte:range_start'
        ]);

        try {
            $file = $request->file('file');
            $pdf = new Fpdi();
            $pagesCount = $pdf->setSourceFile($file->getRealPath());

            $start = $request->input('range_start');
            $end = min($pagesCount, $request->input('range_end'));

            for ($i = $start; $i <= $end; $i++) {
                $templateId = $pdf->importPage($i);
                $size = $pdf->getTemplateSize($templateId);
                $pdf->AddPage($size['orientation'], [$size['width'], $size['height']]);
                $pdf->useTemplate($templateId);
            }

            $outputName = 'Split_' . time() . '.pdf';
            $outputPath = 'public/temp/' . $outputName;
            
            Storage::put($outputPath, $pdf->Output('S'));

            $tool = PdfTool::where('tool_id', 'split-pdf')->first();
            if ($tool) $tool->incrementUsage();

            return response()->json([
                'success' => true,
                'download_url' => Storage::url($outputPath),
                'file_name' => $outputName
            ]);

        } catch (\Exception $e) {
            return response()->json(['success' => false, 'error' => $e->getMessage()], 500);
        }
    }

    /**
     * Add customizable Watermark to PDF files using FPDI Stamping coordinates
     */
    public function watermarkPDF(Request $request)
    {
        $request->validate([
            'file' => 'required|mimes:pdf|max:15360',
            'text' => 'required|string|max:100',
            'color' => 'required|string|max:7', // Hex code
            'opacity' => 'required|integer|between:10,100'
        ]);

        try {
            $file = $request->file('file');
            $text = $request->input('text');
            $colorHex = $request->input('color'); // e.g. #ef4444
            
            $pdf = new Fpdi();
            $pagesCount = $pdf->setSourceFile($file->getRealPath());

            // Hex convertor
            $r = hexdec(substr($colorHex, 1, 2));
            $g = hexdec(substr($colorHex, 3, 2));
            $b = hexdec(substr($colorHex, 5, 2));

            for ($i = 1; $i <= $pagesCount; $i++) {
                $templateId = $pdf->importPage($i);
                $size = $pdf->getTemplateSize($templateId);
                
                $pdf->AddPage($size['orientation'], [$size['width'], $size['height']]);
                $pdf->useTemplate($templateId);
                
                // Add watermark text coordinates
                $pdf->SetFont('Helvetica', 'B', 40);
                $pdf->SetTextColor($r, $g, $b);
                $pdf->Text($size['width'] / 4, $size['height'] / 2, $text);
            }

            $outputName = 'Watermarked_' . time() . '.pdf';
            $outputPath = 'public/temp/' . $outputName;

            Storage::put($outputPath, $pdf->Output('S'));

            $tool = PdfTool::where('tool_id', 'add-watermark')->first();
            if ($tool) $tool->incrementUsage();

            return response()->json([
                'success' => true,
                'download_url' => Storage::url($outputPath),
                'file_name' => $outputName
            ]);

        } catch (\Exception $e) {
            return response()->json(['success' => false, 'error' => $e->getMessage()], 500);
        }
    }

    /**
     * AI-Powered tools proxying to Gemini models secure server integration
     */
    public function aiTranslatePDF(Request $request)
    {
        $request->validate([
            'file' => 'required|mimes:pdf|max:10240',
            'target_language' => 'required|string'
        ]);

        try {
            $file = $request->file('file');
            $parser = new Parser();
            $pdf = $parser->parseFile($file->getRealPath());
            $rawText = $pdf->getText();

            // Intercept and query Gemini API
            $response = Http::withHeaders([
                'Content-Type' => 'application/json',
            ])->post('https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=' . env('GEMINI_API_KEY'), [
                'contents' => [
                    'parts' => [
                        ['text' => "Translate the following parsed PDF plaintext into standard \"{$request->input('target_language')}\". Output strictly only the translated content, matching formatting structures.\n\nParsed Text:\n{$rawText}"]
                    ]
                ]
            ]);

            if (!$response->successful()) {
                throw new \Exception("AI Engine responded with an error setup check: " . $response->body());
            }

            $resultBody = $response->json();
            $translatedText = $resultBody['candidates'][0]['content']['parts'][0]['text'] ?? 'Could not parse translated outputs.';

            $outputName = 'Translated_' . $request->input('target_language') . '_' . time() . '.txt';
            $outputPath = 'public/temp/' . $outputName;

            Storage::put($outputPath, $translatedText);

            $tool = PdfTool::where('tool_id', 'translate-pdf')->first();
            if ($tool) $tool->incrementUsage();

            return response()->json([
                'success' => true,
                'download_url' => Storage::url($outputPath),
                'file_name' => $outputName,
                'preview_text' => Str::limit($translatedText, 1000)
            ]);

        } catch (\Exception $e) {
            return response()->json(['success' => false, 'error' => $e->getMessage()], 500);
        }
    }
}
