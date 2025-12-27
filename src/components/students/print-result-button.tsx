"use client";

import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";

interface PrintResultButtonProps {
    studentName: string;
    studentId: number;
    className: string;
    section: string;
    group?: string;
    year: string;
    examResults: Record<string, any[]>;
}

export function PrintResultButton({
    studentName,
    studentId,
    className,
    section,
    group,
    year,
    examResults,
}: PrintResultButtonProps) {
    const handlePrint = () => {
        const printWindow = window.open("", "_blank");
        if (!printWindow) return;

        const printContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Student Result - ${studentName}</title>
    <style>
        @media print {
            @page {
                margin: 1cm;
            }
        }
        
        body {
            font-family: Arial, sans-serif;
            max-width: 210mm;
            margin: 0 auto;
            padding: 20px;
            background: white;
        }
        
        .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 3px solid #333;
            padding-bottom: 20px;
        }
        
        .header h1 {
            margin: 0;
            font-size: 24px;
            color: #333;
        }
        
        .header p {
            margin: 5px 0;
            color: #666;
        }
        
        .student-info {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 10px;
            margin-bottom: 30px;
            padding: 15px;
            background: #f5f5f5;
            border-radius: 5px;
        }
        
        .info-item {
            display: flex;
        }
        
        .info-label {
            font-weight: bold;
            min-width: 120px;
        }
        
        .exam-section {
            margin-bottom: 40px;
            page-break-inside: avoid;
        }
        
        .exam-title {
            background: #333;
            color: white;
            padding: 10px;
            font-size: 18px;
            font-weight: bold;
            margin-bottom: 15px;
        }
        
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 15px;
        }
        
        th, td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
        }
        
        th {
            background-color: #f8f8f8;
            font-weight: bold;
        }
        
        td.center {
            text-align: center;
        }
        
        .total-row {
            background-color: #f0f0f0;
            font-weight: bold;
        }
        
        .summary {
            display: flex;
            justify-content: space-around;
            margin-top: 10px;
            padding: 10px;
            background: #f8f8f8;
            border-radius: 5px;
        }
        
        .summary-item {
            text-align: center;
        }
        
        .summary-label {
            font-size: 12px;
            color: #666;
        }
        
        .summary-value {
            font-size: 18px;
            font-weight: bold;
            color: #333;
        }
        
        .footer {
            margin-top: 50px;
            display: flex;
            justify-content: space-between;
            padding-top: 20px;
            border-top: 1px solid #ddd;
        }
        
        .signature {
            text-align: center;
            min-width: 200px;
        }
        
        .signature-line {
            border-top: 1px solid #333;
            margin-top: 60px;
            padding-top: 5px;
        }
        
        @media print {
            button {
                display: none;
            }
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>School Management System</h1>
        <p>Academic Year: ${year}</p>
        <p style="font-size: 20px; font-weight: bold; margin-top: 10px;">Student Academic Report</p>
    </div>
    
    <div class="student-info">
        <div class="info-item">
            <span class="info-label">Student Name:</span>
            <span>${studentName}</span>
        </div>
        <div class="info-item">
            <span class="info-label">Student ID:</span>
            <span>${studentId}</span>
        </div>
        <div class="info-item">
            <span class="info-label">Class:</span>
            <span>${className}</span>
        </div>
        <div class="info-item">
            <span class="info-label">Section:</span>
            <span>${section}</span>
        </div>
        ${group ? `
        <div class="info-item">
            <span class="info-label">Group:</span>
            <span>${group}</span>
        </div>
        ` : ''}
    </div>
    
    ${Object.entries(examResults).map(([examName, marks]) => {
        const totalMarks = marks.reduce((sum: number, m: any) => sum + m.marksObtained, 0);
        const totalFullMarks = marks.reduce((sum: number, m: any) => sum + (m.fullMarks || 0), 0);
        const percentage = totalFullMarks > 0 ? ((totalMarks / totalFullMarks) * 100).toFixed(2) : 'N/A';
        
        return `
    <div class="exam-section">
        <div class="exam-title">${examName}</div>
        <table>
            <thead>
                <tr>
                    <th>Subject</th>
                    <th class="center">CQ</th>
                    <th class="center">MCQ</th>
                    <th class="center">Practical</th>
                    <th class="center">Total</th>
                    <th class="center">Full Marks</th>
                </tr>
            </thead>
            <tbody>
                ${marks.map((mark: any) => `
                <tr>
                    <td>${mark.subjectName} <span style="color: #666; font-size: 12px;">(${mark.subjectCode})</span></td>
                    <td class="center">${mark.cqMarks || '-'}</td>
                    <td class="center">${mark.mcqMarks || '-'}</td>
                    <td class="center">${mark.practicalMarks || '-'}</td>
                    <td class="center"><strong>${mark.marksObtained}</strong></td>
                    <td class="center">${mark.fullMarks || '-'}</td>
                </tr>
                `).join('')}
                <tr class="total-row">
                    <td colspan="4">Total</td>
                    <td class="center">${totalMarks}</td>
                    <td class="center">${totalFullMarks}</td>
                </tr>
            </tbody>
        </table>
        <div class="summary">
            <div class="summary-item">
                <div class="summary-label">Total Marks Obtained</div>
                <div class="summary-value">${totalMarks}</div>
            </div>
            <div class="summary-item">
                <div class="summary-label">Total Full Marks</div>
                <div class="summary-value">${totalFullMarks}</div>
            </div>
            <div class="summary-item">
                <div class="summary-label">Percentage</div>
                <div class="summary-value">${percentage}%</div>
            </div>
        </div>
    </div>
        `;
    }).join('')}
    
    <div class="footer">
        <div class="signature">
            <div class="signature-line">Teacher's Signature</div>
        </div>
        <div class="signature">
            <div class="signature-line">Principal's Signature</div>
        </div>
        <div class="signature">
            <div class="signature-line">Guardian's Signature</div>
        </div>
    </div>
    
    <script>
        window.onload = function() {
            window.print();
        };
    </script>
</body>
</html>
        `;

        printWindow.document.write(printContent);
        printWindow.document.close();
    };

    return (
        <Button onClick={handlePrint} variant="outline" size="sm">
            <Printer className="h-4 w-4 mr-2" />
            Print Results
        </Button>
    );
}
