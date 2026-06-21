'use client';

import React, { useState } from 'react';
import { Upload, Trash2, Download } from 'lucide-react';

export default function ATSResumeTracker() {
  const [resumes, setResumes] = useState([]);
  const [jobDescription, setJobDescription] = useState('');
  const [expandedId, setExpandedId] = useState(null);

  const analyzeResume = (text) => {
    const issues = [];
    const score = { base: 100 };

    // Check for tables
    if (/<table|<tr|<td/i.test(text)) {
      issues.push({ type: 'critical', msg: 'Contains HTML tables — ATS cannot parse these' });
      score.base -= 15;
    }

    // Check for special characters that break parsing
    const badChars = text.match(/[●▪▸◆★♦]/g);
    if (badChars) {
      issues.push({ type: 'critical', msg: `Bullet points use special symbols (${badChars[0]}) — use - or * instead` });
      score.base -= 10;
    }

    // Check for images/graphics references
    if (/\[image\]|\[logo\]|\[photo\]|<img|<svg/i.test(text)) {
      issues.push({ type: 'critical', msg: 'Contains images/graphics — ATS skips these entirely' });
      score.base -= 10;
    }

    // Check for columns
    if (/column|col-|grid-template|flex.*row/i.test(text)) {
      issues.push({ type: 'warning', msg: 'May use multi-column layout — ATS reads left-to-right only' });
      score.base -= 8;
    }

    // Check text length
    if (text.length < 100) {
      issues.push({ type: 'warning', msg: 'Text is too short — may be PDF-only (paste plain text instead)' });
      score.base -= 5;
    }

    // Check for missing contact info
    const hasEmail = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(text);
    const hasPhone = /\+?[\d\s\-\(\)]{10,}/.test(text);
    if (!hasEmail) {
      issues.push({ type: 'warning', msg: 'No email address found — add yours at the top' });
      score.base -= 5;
    }

    // Check for standard sections
    const sections = ['experience', 'education', 'skills', 'projects'];
    const foundSections = sections.filter(s => 
      new RegExp(s, 'i').test(text)
    ).length;
    if (foundSections < 3) {
      issues.push({ type: 'warning', msg: `Only ${foundSections}/4 standard sections found — add Experience, Education, Skills, Projects` });
      score.base -= 8;
    }

    // Check for formatting consistency
    const bulletCount = (text.match(/^[\s]*[-*•]/gm) || []).length;
    if (bulletCount === 0 && text.length > 500) {
      issues.push({ type: 'info', msg: 'No bullet points detected — consider adding them for readability' });
    }

    // Keyword matching with job description
    if (jobDescription.length > 20) {
      const jobKeywords = jobDescription
        .toLowerCase()
        .match(/\b[a-z]+\b/g)
        .filter(w => w.length > 3);
      
      const resumeText = text.toLowerCase();
      const matchedKeywords = new Set(
        jobKeywords.filter(k => resumeText.includes(k))
      );
      
      const matchRate = (matchedKeywords.size / jobKeywords.length) * 100;
      if (matchRate < 40) {
        issues.push({ 
          type: 'warning', 
          msg: `Low job match (${matchRate.toFixed(0)}%) — your resume lacks keywords from the job description` 
        });
        score.base -= Math.min(15, 15 - (matchRate / 100) * 15);
      }
    }

    // Font/styling check (heuristic)
    if (/comic sans|impact|wingdings/i.test(text)) {
      issues.push({ type: 'warning', msg: 'Uses unusual fonts — stick to Arial, Calibri, or Times New Roman' });
      score.base -= 5;
    }

    // Check for excessive formatting
    if (/(bold|italic|underline|color|size)\s*:/.test(text)) {
      issues.push({ type: 'info', msg: 'Heavy formatting detected — ATS may strip styling; content is what matters' });
    }

    // Positive checks
    if (foundSections >= 3) {
      issues.push({ type: 'success', msg: 'Clear section headers found ✓' });
    }
    if (hasEmail) {
      issues.push({ type: 'success', msg: 'Contact email included ✓' });
    }
    if (bulletCount > 5) {
      issues.push({ type: 'success', msg: 'Good use of bullet points ✓' });
    }

    return {
      score: Math.max(0, Math.min(100, score.base)),
      issues: issues.sort((a, b) => {
        const priority = { critical: 0, warning: 1, info: 2, success: 3 };
        return priority[a.type] - priority[b.type];
      })
    };
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target.result;
      const analysis = analyzeResume(text);
      setResumes([
        ...resumes,
        {
          id: Date.now(),
          name: file.name.replace(/\.[^/.]+$/, ''),
          text: text,
          ...analysis,
          timestamp: new Date().toLocaleString()
        }
      ]);
    };
    reader.readAsText(file);
  };

  const handlePasteResume = () => {
    const text = prompt('Paste your resume text here:');
    if (!text) return;

    const analysis = analyzeResume(text);
    const name = prompt('Name this version (e.g., "v1-final")', 'Resume v' + (resumes.length + 1)) || 'Resume v' + (resumes.length + 1);

    setResumes([
      ...resumes,
      {
        id: Date.now(),
        name: name,
        text: text,
        ...analysis,
        timestamp: new Date().toLocaleString()
      }
    ]);
  };

  const deleteResume = (id) => {
    setResumes(resumes.filter(r => r.id !== id));
  };

  const downloadReport = () => {
    const csv = [
      ['Resume', 'ATS Score', 'Timestamp', 'Issues Count'],
      ...resumes.map(r => [
        r.name,
        r.score,
        r.timestamp,
        r.issues.filter(i => i.type !== 'success').length
      ])
    ].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ats-tracker-report.csv';
    a.click();
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'bg-green-100 text-green-800';
    if (score >= 60) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <div style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      {/* Header */}
      <div style={{ backgroundColor: '#1a1a2e', color: '#fff', padding: '24px' }}>
        <h1 style={{ margin: '0 0 8px 0', fontSize: '28px' }}>ATS Resume Tracker</h1>
        <p style={{ margin: '0', fontSize: '14px', color: '#aaa' }}>
          Check your resume for ATS compatibility • Track versions • Match job descriptions
        </p>
      </div>

      {/* Main Container */}
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '24px' }}>
        
        {/* Job Description Input */}
        <div style={{ marginBottom: '24px', border: '1px solid #ddd', borderRadius: '8px', padding: '16px', backgroundColor: '#f9f9f9' }}>
          <h3 style={{ marginTop: '0', fontSize: '16px' }}>Optional: Paste Job Description</h3>
          <p style={{ fontSize: '13px', color: '#666', margin: '0 0 12px 0' }}>
            Helps identify keyword gaps in your resume
          </p>
          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste job description to match keywords..."
            style={{
              width: '100%',
              height: '100px',
              padding: '10px',
              borderRadius: '4px',
              border: '1px solid #ddd',
              fontFamily: 'monospace',
              fontSize: '12px',
              boxSizing: 'border-box'
            }}
          />
        </div>

        {/* Upload Section */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
          <label style={{ flex: 1 }}>
            <input
              type="file"
              accept=".txt,.pdf"
              onChange={handleFileUpload}
              style={{ display: 'none' }}
            />
            <div style={{
              border: '2px dashed #007bff',
              borderRadius: '8px',
              padding: '16px',
              textAlign: 'center',
              cursor: 'pointer',
              backgroundColor: '#f0f7ff',
              transition: 'all 0.3s'
            }}>
              <Upload style={{ width: '20px', height: '20px', margin: '0 auto 8px' }} />
              <p style={{ margin: '0', fontSize: '14px', fontWeight: '500' }}>Upload .txt or .pdf</p>
              <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#666' }}>Paste plain text from your resume</p>
            </div>
          </label>
          <button
            onClick={handlePasteResume}
            style={{
              padding: '16px 24px',
              backgroundColor: '#28a745',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '500',
              fontSize: '14px'
            }}
          >
            Or Paste Text
          </button>
        </div>

        {/* Resume List */}
        {resumes.length > 0 && (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h2 style={{ margin: '0', fontSize: '18px' }}>Your Resumes ({resumes.length})</h2>
              <button
                onClick={downloadReport}
                style={{
                  padding: '8px 12px',
                  backgroundColor: '#6c757d',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Download style={{ width: '14px', height: '14px' }} />
                Download CSV
              </button>
            </div>

            {resumes.map((resume) => (
              <div
                key={resume.id}
                style={{
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  marginBottom: '16px',
                  overflow: 'hidden',
                  backgroundColor: '#fff'
                }}
              >
                {/* Header */}
                <div
                  onClick={() => setExpandedId(expandedId === resume.id ? null : resume.id)}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '16px',
                    cursor: 'pointer',
                    backgroundColor: expandedId === resume.id ? '#f9f9f9' : '#fff',
                    borderBottom: expandedId === resume.id ? '1px solid #ddd' : 'none'
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <h3 style={{ margin: '0 0 4px 0', fontSize: '16px' }}>{resume.name}</h3>
                    <p style={{ margin: '0', fontSize: '12px', color: '#666' }}>{resume.timestamp}</p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div className={getScoreColor(resume.score)} style={{
                      padding: '8px 16px',
                      borderRadius: '20px',
                      fontWeight: 'bold',
                      fontSize: '16px'
                    }}>
                      {resume.score}
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteResume(resume.id);
                      }}
                      style={{
                        padding: '8px',
                        backgroundColor: '#dc3545',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center'
                      }}
                    >
                      <Trash2 style={{ width: '16px', height: '16px' }} />
                    </button>
                  </div>
                </div>

                {/* Details */}
                {expandedId === resume.id && (
                  <div style={{ padding: '16px', backgroundColor: '#f9f9f9', fontSize: '13px' }}>
                    <h4 style={{ margin: '0 0 12px 0', fontSize: '14px' }}>Issues & Feedback:</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {resume.issues.map((issue, idx) => (
                        <div
                          key={idx}
                          style={{
                            padding: '10px 12px',
                            borderRadius: '4px',
                            backgroundColor: 
                              issue.type === 'critical' ? '#fee' :
                              issue.type === 'warning' ? '#ffeaa7' :
                              issue.type === 'success' ? '#d4edda' :
                              '#e7f3ff',
                            borderLeft: `3px solid ${
                              issue.type === 'critical' ? '#dc3545' :
                              issue.type === 'warning' ? '#ffc107' :
                              issue.type === 'success' ? '#28a745' :
                              '#007bff'
                            }`
                          }}
                        >
                          {issue.msg}
                        </div>
                      ))}
                    </div>

                    {/* Quick Stats */}
                    <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #ddd' }}>
                      <p style={{ margin: '0', fontSize: '12px', color: '#666' }}>
                        <strong>{resume.text.length}</strong> characters • 
                        <strong> {resume.text.split(/\s+/).length}</strong> words • 
                        <strong> {(resume.text.match(/^[\s]*[-*•]/gm) || []).length}</strong> bullet points
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </>
        )}

        {/* Empty State */}
        {resumes.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '48px 24px',
            color: '#999',
            backgroundColor: '#f9f9f9',
            borderRadius: '8px',
            border: '1px dashed #ddd'
          }}>
            <p style={{ fontSize: '16px', margin: '0' }}>No resumes uploaded yet</p>
            <p style={{ fontSize: '13px', margin: '8px 0 0 0' }}>Upload or paste your resume above to get your ATS score</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={{
        backgroundColor: '#f0f0f0',
        padding: '24px',
        marginTop: '40px',
        textAlign: 'center',
        borderTop: '1px solid #ddd'
      }}>
        <p style={{ margin: '0 0 12px 0', fontSize: '14px' }}>
          <strong>Pragyan Pranati Pujhari</strong><br />
          pragyantitlee@gmail.com
        </p>
        <a
          href="https://digitalheroesco.com"
          style={{
            display: 'inline-block',
            padding: '12px 24px',
            backgroundColor: '#007bff',
            color: '#fff',
            textDecoration: 'none',
            borderRadius: '4px',
            fontWeight: '500',
            fontSize: '14px'
          }}
        >
          Built for Digital Heroes
        </a>
      </div>
    </div>
  );
}
