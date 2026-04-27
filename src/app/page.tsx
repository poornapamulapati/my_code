'use client';

import React, { useState, useEffect } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { 
  Folder, FolderOpen, FileCode, FileImage, 
  FileText, Code, Play, TerminalSquare, Code2
} from 'lucide-react';

interface FileNode {
  name: string;
  type: 'file' | 'folder';
  path: string;
  children?: FileNode[];
}

export default function CodeGallery() {
  const [fileTree, setFileTree] = useState<FileNode[]>([]);
  const [selectedFile, setSelectedFile] = useState<FileNode | null>(null);
  const [fileContent, setFileContent] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'code' | 'preview'>('code');
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/files')
      .then(res => res.json())
      .then(data => {
        setFileTree(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load file tree', err);
        setLoading(false);
      });
  }, []);

  const toggleFolder = (path: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(path)) {
      newExpanded.delete(path);
    } else {
      newExpanded.add(path);
    }
    setExpandedFolders(newExpanded);
  };

  const handleFileSelect = async (file: FileNode) => {
    setSelectedFile(file);
    if (file.name.endsWith('.html')) {
      setActiveTab('preview');
    } else {
      setActiveTab('code');
    }

    setFileContent('Loading...');
    try {
      // Directly fetch the static file from the public/tasks folder
      const res = await fetch(`/tasks/${file.path}`);
      if (!res.ok) throw new Error('Failed to fetch file');
      
      const isImage = file.name.match(/\.(jpeg|jpg|gif|png|webp|svg)$/i);
      const isVideo = file.name.match(/\.(mp4|webm|ogg)$/i);
      
      if (isImage || isVideo) {
        setFileContent('Binary file preview not supported in code viewer.');
      } else {
        const text = await res.text();
        setFileContent(text);
      }
    } catch (err) {
      setFileContent('Error loading file content.');
    }
  };

  const getFileIcon = (name: string) => {
    if (name.endsWith('.html')) return <Code size={16} color="#e34c26" />;
    if (name.endsWith('.css')) return <FileCode size={16} color="#264de4" />;
    if (name.endsWith('.js') || name.endsWith('.ts')) return <FileCode size={16} color="#f0db4f" />;
    if (name.endsWith('.png') || name.endsWith('.jpg') || name.endsWith('.jpeg')) return <FileImage size={16} color="#4ade80" />;
    return <FileText size={16} color="#94a3b8" />;
  };

  const renderTree = (nodes: FileNode[], depth = 0) => {
    return nodes.map(node => {
      if (node.type === 'folder') {
        const isExpanded = expandedFolders.has(node.path);
        return (
          <div key={node.path}>
            <div 
              className="tree-item"
              style={{ paddingLeft: `${depth * 16 + 8}px` }}
              onClick={() => toggleFolder(node.path)}
            >
              <div className="tree-item-icon">
                {isExpanded ? <FolderOpen size={16} color="#fbbf24" /> : <Folder size={16} color="#fbbf24" />}
              </div>
              <span className="tree-item-name">{node.name}</span>
            </div>
            {isExpanded && node.children && (
              <div className="tree-children-wrapper">
                {renderTree(node.children, depth + 1)}
              </div>
            )}
          </div>
        );
      } else {
        return (
          <div 
            key={node.path}
            className={`tree-item ${selectedFile?.path === node.path ? 'active' : ''}`}
            style={{ paddingLeft: `${depth * 16 + 8}px` }}
            onClick={() => handleFileSelect(node)}
          >
            <div className="tree-item-icon">
              {getFileIcon(node.name)}
            </div>
            <span className="tree-item-name">{node.name}</span>
          </div>
        );
      }
    });
  };

  const getLanguage = (filename: string) => {
    if (filename.endsWith('.js')) return 'javascript';
    if (filename.endsWith('.html')) return 'html';
    if (filename.endsWith('.css')) return 'css';
    if (filename.endsWith('.json')) return 'json';
    return 'text';
  };

  return (
    <div className="app-container">
      <aside className="sidebar glass-panel">
        <div className="sidebar-header">
          <TerminalSquare size={24} color="#60a5fa" />
          <h1>JS Training Hub</h1>
        </div>
        <div className="file-tree">
          {loading ? (
            <div style={{ padding: '20px', color: 'var(--text-secondary)' }}>Loading...</div>
          ) : (
            renderTree(fileTree)
          )}
        </div>
      </aside>

      <main className="main-area glass-panel">
        {selectedFile ? (
          <>
            <div className="tabs">
              <div 
                className={`tab ${activeTab === 'code' ? 'active' : ''}`}
                onClick={() => setActiveTab('code')}
              >
                <Code size={16} /> Source Code
              </div>
              {selectedFile.name.endsWith('.html') && (
                <div 
                  className={`tab ${activeTab === 'preview' ? 'active' : ''}`}
                  onClick={() => setActiveTab('preview')}
                >
                  <Play size={16} /> Live Preview
                </div>
              )}
            </div>
            
            <div className="content-view">
              {activeTab === 'code' ? (
                <div className="code-container">
                  <SyntaxHighlighter
                    language={getLanguage(selectedFile.name)}
                    style={vscDarkPlus}
                    showLineNumbers={true}
                    customStyle={{ background: 'transparent' }}
                  >
                    {fileContent}
                  </SyntaxHighlighter>
                </div>
              ) : (
                <iframe 
                  src={`/tasks/${selectedFile.path}`} 
                  className="preview-iframe"
                  title="Live Preview"
                />
              )}
            </div>
          </>
        ) : (
          <div className="empty-state">
            <Code2 size={64} />
            <p>Select a file from the sidebar to view code or preview.</p>
          </div>
        )}
      </main>
    </div>
  );
}
