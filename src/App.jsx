import React, { useState } from 'react';
import { 
  FileText, 
  Folder, 
  Download, 
  HardDrive, 
  LogOut,
  Search,
  ChevronRight,
  ArrowLeft,
  Layers,
  Layout,
  FolderTree
} from 'lucide-react';

// Mock Data for Scenario Two (Drill-down)
const DRIVE_DATA = {
  id: 'root',
  name: 'My Drive',
  children: [
    {
      id: 'f1',
      name: 'Engineering_Docs',
      type: 'folder',
      children: [
        {
          id: 'f1_sub',
          name: 'Sprint_Archives',
          type: 'folder',
          children: [
            { id: 'file_a', name: 'recon_20250308.csv', type: 'file', size: '1.1 MB' },
            { id: 'file_b', name: 'recon_20250309.csv', type: 'file', size: '450 KB' }
          ]
        },
        { id: 'file_c', name: 'recon_20250310.csv', type: 'file', size: '3.4 MB' },
      ]
    },
    {
      id: 'f2',
      name: 'Legal_Compliance',
      type: 'folder',
      children: [
        { id: 'file_e', name: 'recon_20250311.csv', type: 'file', size: '85 KB' },
      ]
    },
    { id: 'file_g', name: 'recon_20250312.csv', type: 'file', size: '12 KB' },
  ]
};

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null); // 1, 2, or 3
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [selectedSidebarFolder, setSelectedSidebarFolder] = useState('Documents');

  const handleLogin = (e) => {
    e.preventDefault();
    const validPassword = 'password123';
    
    if (password !== validPassword) {
      setError('Invalid password.');
      return;
    }

    if (username === 'user1') {
      setCurrentUser(1);
      setIsLoggedIn(true);
      setError('');
    } else if (username === 'user2') {
      setCurrentUser(2);
      setIsLoggedIn(true);
      setError('');
    } else if (username === 'user3') {
      setCurrentUser(3);
      setIsLoggedIn(true);
      setError('');
    } else {
      setError('Unknown user. Use user1, user2, or user3.');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    setUsername('');
    setPassword('');
  };

  if (!isLoggedIn) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-100 p-4">
        <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-lg border border-slate-200">
          <div className="flex flex-col items-center mb-8">
            <div className="p-3 bg-blue-100 rounded-full mb-4">
              <HardDrive className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-2xl font-bold text-slate-800">SFTP Playground</h1>
            <p className="text-slate-500 text-sm text-center">Automation Target System</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Username</label>
              <input 
                id="login-username" 
                type="text" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                placeholder="user1, user2, or user3" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
              <input 
                id="login-password" 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                placeholder="password123" 
              />
            </div>
            {error && <p id="error-message" className="text-red-500 text-xs italic">{error}</p>}
            <button id="login-button" type="submit" className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition-colors">Login</button>
          </form>
          
          <div className="mt-6 p-3 bg-slate-50 rounded text-[11px] text-slate-500 border border-dashed border-slate-300">
            <strong>Dev Note:</strong> user1 (Flat), user2 (Drill-down), user3 (Sidebar)
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-2">
          <HardDrive className="w-6 h-6 text-blue-600" />
          <span className="font-bold text-slate-800">SFTP CONSOLE</span>
          <span className="ml-4 px-2 py-0.5 bg-blue-50 text-blue-600 text-[10px] font-bold rounded border border-blue-100">
            SCENARIO {currentUser}
          </span>
        </div>
        
        <div className="flex items-center gap-4">
          <span id="user-display" className="text-sm text-slate-500 hidden sm:inline">Logged in as: <strong>{username}</strong></span>
          <button onClick={handleLogout} className="flex items-center gap-2 px-3 py-1 text-sm font-medium text-slate-600 hover:text-red-600 transition-all">
            <LogOut size={16} /> Logout
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-auto p-4 sm:p-6">
        <div className="max-w-6xl mx-auto h-full">
          {currentUser === 1 && <ScenarioOne />}
          {currentUser === 2 && <ScenarioTwo />}
          {currentUser === 3 && <ScenarioThree selectedFolder={selectedSidebarFolder} setSelectedFolder={setSelectedSidebarFolder} />}
        </div>
      </main>
    </div>
  );
};

/* SCENARIO 1: Flat List (User 1) */
const ScenarioOne = () => {
  const files = [
    { name: 'recon_20250304.csv', size: '2.4 MB', date: 'Mar 04, 2025' },
    { name: 'recon_20250305.csv', size: '15.8 MB', date: 'Mar 05, 2025' },
    { name: 'recon_20250306.csv', size: '12 KB', date: 'Mar 06, 2025' },
    { name: 'recon_20250307.csv', size: '142 MB', date: 'Mar 07, 2025' },
  ];

  const downloadFile = (fileName) => {
    const dummyContent = `Dummy file content for ${fileName}\nGenerated at: ${new Date().toISOString()}`;
    const blob = new Blob([dummyContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div id="scenario-1-container" className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-4 border-b bg-slate-50/50 flex justify-between items-center">
        <div className="flex items-center gap-2 font-semibold text-slate-700">
          <Layout size={18} className="text-blue-500" />
          <span>Scenario 1: Flat List Interface</span>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
          <input className="pl-9 pr-4 py-1 text-xs border rounded-full w-48 outline-none focus:ring-1 focus:ring-blue-400" placeholder="Filter files..." />
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-slate-500 text-[10px] uppercase tracking-wider">
            <tr>
              <th className="px-6 py-3">File Name</th>
              <th className="px-6 py-3">Size</th>
              <th className="px-6 py-3">Modified</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {files.map((f, i) => (
              <tr key={i} className="hover:bg-blue-50/50 file-row" data-filename={f.name}>
                <td className="px-6 py-4 flex items-center gap-2 text-sm font-medium text-slate-700">
                  <FileText size={16} className="text-blue-500"/> {f.name}
                </td>
                <td className="px-6 py-4 text-sm text-slate-500">{f.size}</td>
                <td className="px-6 py-4 text-sm text-slate-500">{f.date}</td>
                <td className="px-6 py-4 text-right">
                  <button 
                    onClick={() => downloadFile(f.name)}
                    className="p-2 text-slate-400 hover:text-blue-600 download-action"
                  >
                    <Download size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

/* SCENARIO 2: Full Screen Drill-Down Tree (User 2) */
const ScenarioTwo = () => {
  const [history, setHistory] = useState([DRIVE_DATA]);
  const currentFolder = history[history.length - 1];

  const navigateTo = (folder) => {
    if (folder.type === 'folder') setHistory([...history, folder]);
  };

  const goBack = () => {
    if (history.length > 1) setHistory(history.slice(0, -1));
  };

  const jumpTo = (index) => setHistory(history.slice(0, index + 1));

  const downloadFile = (fileName) => {
    const dummyContent = `Dummy file content for ${fileName}\nGenerated at: ${new Date().toISOString()}`;
    const blob = new Blob([dummyContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const folders = currentFolder.children.filter(item => item.type === 'folder');
  const files = currentFolder.children.filter(item => item.type === 'file');

  return (
    <div id="scenario-2-container" className="bg-white rounded-xl shadow-sm border border-slate-200 min-h-[500px] flex flex-col">
      <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-4 bg-slate-50/30">
        <button 
          onClick={goBack} 
          disabled={history.length === 1}
          className={`p-2 rounded-full transition-colors ${history.length === 1 ? 'text-slate-300' : 'text-slate-600 hover:bg-slate-200'}`}
          id="back-button"
        >
          <ArrowLeft size={20} />
        </button>
        
        <div className="flex items-center gap-1 text-sm font-medium overflow-hidden">
          {history.map((folder, idx) => (
            <React.Fragment key={folder.id}>
              {idx !== 0 && <ChevronRight size={14} className="text-slate-400" />}
              <button 
                onClick={() => jumpTo(idx)}
                className={`hover:text-blue-600 truncate max-w-[150px] ${idx === history.length - 1 ? 'text-slate-900 font-bold' : 'text-slate-500'}`}
                data-breadcrumb-idx={idx}
              >
                {folder.name}
              </button>
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="p-6">
        {folders.length > 0 && (
          <div className="mb-8">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Folders</h3>
            <div className="grid grid-cols-1 gap-2">
              {folders.map(folder => (
                <div 
                  key={folder.id}
                  onClick={() => navigateTo(folder)}
                  className="flex items-center justify-between p-4 border border-slate-100 rounded-xl hover:border-blue-200 hover:bg-blue-50/30 cursor-pointer transition-all group folder-row"
                  data-folder-id={folder.id}
                >
                  <div className="flex items-center gap-4">
                    <Folder className="text-blue-500 fill-blue-500/10 group-hover:fill-blue-500/20" size={20} />
                    <span className="text-sm font-semibold text-slate-700 truncate">{folder.name}</span>
                  </div>
                  <ChevronRight size={18} className="text-slate-300 group-hover:text-blue-500 transition-colors" />
                </div>
              ))}
            </div>
          </div>
        )}

        <div>
          <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Files</h3>
          {files.length > 0 ? (
            <div className="grid grid-cols-1 gap-2">
              {files.map(file => (
                <div 
                  key={file.id} 
                  className="flex items-center justify-between p-4 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors group file-item"
                  data-file-id={file.id}
                >
                  <div className="flex items-center gap-4">
                    <FileText size={20} className="text-slate-400" />
                    <div>
                      <p className="text-sm font-medium text-slate-800">{file.name}</p>
                      <p className="text-xs text-slate-400">{file.size} • Last modified Oct 2023</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => downloadFile(file.name)}
                    className="p-2 text-slate-400 hover:text-blue-600 hover:bg-white rounded-full transition-all download-action-drilldown"
                  >
                    <Download size={18} />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-slate-400">
               <Folder size={32} className="mb-2 opacity-20" />
               <p className="text-sm italic">Empty directory</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/* SCENARIO 3: Sidebar Navigation (User 3) */
const ScenarioThree = ({ selectedFolder, setSelectedFolder }) => {
  const folders = [
    { name: 'Documents', count: 3 }, 
    { name: 'Invoices', count: 2 }, 
    { name: 'Exports', count: 2 }
  ];
  
  const files = {
    'Documents': ['recon_20250313.csv', 'recon_20250314.csv', 'recon_20250315.csv'],
    'Invoices': ['recon_20250316.csv', 'recon_20250317.csv'],
    'Exports': ['recon_20250318.csv', 'recon_20250319.csv']
  };

  const downloadFile = (fileName) => {
    const dummyContent = `Dummy file content for ${fileName}\nGenerated at: ${new Date().toISOString()}`;
    const blob = new Blob([dummyContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div id="scenario-3-container" className="flex bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden h-[550px]">
      <aside className="w-60 border-r border-slate-100 bg-slate-50/50 p-4 shrink-0">
        <div className="mb-6 px-2">
           <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Library</h3>
        </div>
        <ul className="space-y-1">
          {folders.map(f => (
            <button 
              key={f.name} 
              onClick={() => setSelectedFolder(f.name)} 
              data-nav-target={f.name.toLowerCase()}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-all sidebar-btn ${
                selectedFolder === f.name ? 'bg-blue-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-200'
              }`}
            >
              <div className="flex items-center gap-2">
                <Folder size={16} fill={selectedFolder === f.name ? 'white' : 'transparent'} />
                <span>{f.name}</span>
              </div>
              <span className={`text-[10px] px-1.5 rounded-full ${selectedFolder === f.name ? 'bg-blue-500' : 'bg-slate-200'}`}>
                {f.count}
              </span>
            </button>
          ))}
        </ul>
      </aside>
      
      <section className="flex-1 flex flex-col min-w-0">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
           <h2 id="view-title" className="text-xl font-bold text-slate-800">{selectedFolder}</h2>
           <div className="text-xs text-slate-400">Path: /home/sftp/{selectedFolder.toLowerCase()}</div>
        </div>
        
        <div className="p-6 overflow-auto space-y-3">
          {files[selectedFolder].map((f, idx) => (
            <div key={f} className="p-4 border border-slate-100 rounded-xl flex justify-between items-center hover:border-blue-200 transition-all group file-card" data-idx={idx}>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-100 rounded group-hover:bg-blue-50 text-slate-500 group-hover:text-blue-500 transition-colors">
                  <FileText size={20} />
                </div>
                <span className="text-sm font-medium text-slate-700">{f}</span>
              </div>
              <button 
                onClick={() => downloadFile(f)}
                className="px-4 py-1.5 bg-slate-50 text-blue-600 text-xs font-bold rounded-lg hover:bg-blue-600 hover:text-white transition-all sidebar-download"
              >
                Fetch File
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default App;
