import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { Plus, Layout, LogOut, Pencil, Trash2, X } from 'lucide-react';

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [newProject, setNewProject] = useState({ name: '', description: '' });
  const [editingProject, setEditingProject] = useState(null);
  const navigate = useNavigate();

  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  const currentUserId = user?.id || user?._id;
  const isAdmin = user?.role === 'admin';

  const loadProjects = async () => { try { const { data } = await api.get('/projects'); setProjects(data); } catch (e) { console.error(e); } };
  const createProject = async (e) => { e.preventDefault(); try { await api.post('/projects', newProject); setNewProject({ name: '', description: '' }); loadProjects(); } catch (e) { alert('Error'); } };
  const deleteProject = async (e, projectId) => { e.stopPropagation(); if (window.confirm("Delete project?")) { try { await api.delete(`/projects/${projectId}`); setProjects(c => c.filter(p => p._id !== projectId)); } catch (e) { alert("Failed"); } } };
  const saveEdit = async (e) => { e.preventDefault(); try { await api.put(`/projects/${editingProject._id}`, { name: editingProject.name, description: editingProject.description }); setEditingProject(null); loadProjects(); } catch (e) { alert("Failed"); } };
  
  useEffect(() => { loadProjects(); }, []);

  return (
    <div className="app-container">
      <nav className="navbar">
        <span className="logo-small">ORBIT</span>
        <button onClick={() => { localStorage.clear(); navigate('/login'); }} className="btn-logout">
          <LogOut size={16}/> Logout
        </button>
      </nav>
      
      <main className="content">
        <div className="header-row">
          <h1>Projects</h1>
          {/* Inline flex style kept for alignment, perfectly safe */}
          <form onSubmit={createProject} style={{display: 'flex', gap: '10px', alignItems: 'center'}}>
            <input placeholder="New Project..." value={newProject.name} onChange={e => setNewProject({...newProject, name: e.target.value})} required style={{width: '200px'}}/>
            <button type="submit" className="btn-icon"><Plus size={20}/></button>
          </form>
        </div>

        <div className="grid">
          {projects.map(p => {
            const isOwner = currentUserId && (p.createdBy === currentUserId || p.owner === currentUserId);
            const canEdit = isAdmin || isOwner;
            const canDelete = isAdmin; 

            return (
              <div key={p._id} className="card" onClick={() => navigate(`/projects/${p._id}`)} style={{cursor: 'pointer'}}>
                <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '10px'}}>
                  <Layout size={24} color="#6366f1" />
                  <div style={{display: 'flex', gap: '5px'}}>
                    {canEdit && <button onClick={(e) => { e.stopPropagation(); setEditingProject(p); }} style={{background:'none', border:'none', color:'#9ca3af'}}><Pencil size={18}/></button>}
                    {canDelete && <button onClick={(e) => deleteProject(e, p._id)} style={{background:'none', border:'none', color:'#ef4444'}}><Trash2 size={18}/></button>}
                  </div>
                </div>
                <h3 style={{margin: '0 0 5px 0', fontSize: '18px'}}>{p.name}</h3>
                <p style={{margin: 0, color: '#6b7280', fontSize: '14px'}}>{p.description || "No description."}</p>
              </div>
            );
          })}
        </div>
      </main>

      {/* Modal uses inline styles because your CSS didn't have a .modal class. This ensures it doesn't break. */}
      {editingProject && (
        <div style={{position:'fixed', top:0, left:0, right:0, bottom:0, background:'rgba(0,0,0,0.5)', display:'flex', justifyContent:'center', alignItems:'center', zIndex:100}}>
          <form onSubmit={saveEdit} className="card" style={{width: '400px', height: 'auto'}}>
            <div style={{display:'flex', justifyContent:'space-between', marginBottom:'20px'}}>
              <h2>Edit Project</h2>
              <button type="button" onClick={() => setEditingProject(null)} style={{background:'none', border:'none'}}><X size={24}/></button>
            </div>
            <label style={{marginBottom:'5px', fontWeight:'600', display:'block'}}>Name</label>
            <input value={editingProject.name} onChange={e => setEditingProject({...editingProject, name: e.target.value})} style={{marginBottom:'15px'}}/>
            <label style={{marginBottom:'5px', fontWeight:'600', display:'block'}}>Description</label>
            <textarea value={editingProject.description} onChange={e => setEditingProject({...editingProject, description: e.target.value})} style={{marginBottom:'20px', minHeight: '100px'}}/>
            <button type="submit" className="btn-primary">Save Changes</button>
          </form>
        </div>
      )}
    </div>
  );
}