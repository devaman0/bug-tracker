import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, X } from 'lucide-react';

export default function ProjectDetails() {
  const { id } = useParams();
  const [bugs, setBugs] = useState([]);
  const navigate = useNavigate();
  const [newBug, setNewBug] = useState({ title: '', description: '', priority: 'medium' });
  const [editingBug, setEditingBug] = useState(null); 
  
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  const currentUserId = user?.id || user?._id;
  const isAdmin = user?.role === 'admin';

  const loadBugs = async () => { try { const { data } = await api.get(`/projects/${id}/bugs`); setBugs(data); } catch (e) { console.error(e); } };
  const createBug = async (e) => { e.preventDefault(); try { await api.post(`/projects/${id}/bugs`, newBug); setNewBug({ title: '', description: '', priority: 'medium' }); loadBugs(); } catch (e) { alert("Failed"); } };
  const deleteBug = async (e, bugId) => { e.stopPropagation(); if(window.confirm("Delete?")) { try { await api.delete(`/bugs/${bugId}`); setBugs(c => c.filter(b => b._id !== bugId)); } catch (e) { alert("Failed"); } } };
  const updateStatus = async (e, bugId, newStatus) => { e.stopPropagation(); try { await api.put(`/bugs/${bugId}`, { status: newStatus }); loadBugs(); } catch (e) { alert("Failed"); } };
  const saveEdit = async (e) => { e.preventDefault(); try { await api.put(`/bugs/${editingBug._id}`, { title: editingBug.title, description: editingBug.description, priority: editingBug.priority, status: editingBug.status }); setEditingBug(null); loadBugs(); } catch (err) { alert("Failed"); } };

  useEffect(() => { loadBugs(); }, [id]);

  return (
    <div className="app-container">
      <nav className="navbar">
        <span className="logo-small">ORBIT</span>
        <button onClick={() => { localStorage.clear(); navigate('/login'); }} className="btn-logout">Logout</button>
      </nav>
      
      <main className="content">
        <div className="header-row">
          <div>
            <button onClick={() => navigate('/projects')} style={{background:'none', border:'none', cursor:'pointer', display:'flex', alignItems:'center', gap:'5px', color:'#6b7280', marginBottom:'5px'}}>
              <ArrowLeft size={16}/> Back
            </button>
            <h1 style={{margin:0}}>Issues</h1>
          </div>
          <form onSubmit={createBug} style={{display:'flex', gap:'10px'}}>
             <input placeholder="New Issue..." value={newBug.title} onChange={e => setNewBug({...newBug, title: e.target.value})} required/>
             <select value={newBug.priority} onChange={e => setNewBug({...newBug, priority: e.target.value})} style={{width:'100px'}}>
               <option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option>
             </select>
             <button type="submit" className="btn-icon"><Plus size={20}/></button>
          </form>
        </div>

        <div className="bug-stack">
          {bugs.length === 0 ? <p style={{textAlign:'center', color:'#9ca3af'}}>No issues found.</p> : bugs.map(b => {
            const isOwner = currentUserId && (b.createdBy === currentUserId || b.owner === currentUserId);
            const canEdit = isAdmin || isOwner;
            const canDelete = isAdmin; 

            return (
              <div key={b._id} onClick={() => setEditingBug(b)} className="bug-row" style={{cursor: 'pointer'}}>
                <div style={{maxWidth: '60%'}}>
                  <div style={{display:'flex', alignItems:'center', marginBottom:'5px'}}>
                    <strong style={{fontSize:'16px'}}>{b.title}</strong>
                    <span className={`priority-badge ${b.priority}`}>{b.priority}</span>
                    <span className={`status-badge ${b.status ? b.status.replace(' ', '-') : 'open'}`}>{b.status || 'open'}</span>
                  </div>
                  <p style={{margin:0, fontSize:'14px', color:'#6b7280', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis'}}>{b.description || "No description."}</p>
                </div>
                <div style={{display:'flex', alignItems:'center', gap:'10px'}}>
                  <select 
                    value={b.status || 'open'} 
                    onClick={(e) => e.stopPropagation()} 
                    onChange={(e) => updateStatus(e, b._id, e.target.value)} 
                    disabled={!canEdit}
                    style={{width:'120px', cursor: canEdit ? 'pointer' : 'not-allowed', opacity: canEdit ? 1 : 0.6}}
                  >
                    <option value="open">Open</option><option value="in-progress">In Progress</option><option value="resolved">Resolved</option>
                  </select>
                  {canDelete && <button onClick={(e) => deleteBug(e, b._id)} style={{background:'none', border:'none', color:'#ef4444', cursor:'pointer'}}><Trash2 size={18}/></button>}
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* Modal uses inline styles to ensure safety since no modal class exists in CSS */}
      {editingBug && (
        <div style={{position:'fixed', top:0, left:0, right:0, bottom:0, background:'rgba(0,0,0,0.5)', display:'flex', justifyContent:'center', alignItems:'center', zIndex:100}}>
          <form onSubmit={saveEdit} className="card" style={{width: '450px', height: 'auto'}}>
            <div style={{display:'flex', justifyContent:'space-between', marginBottom:'20px'}}>
              <h2>Edit Issue</h2>
              <button type="button" onClick={() => setEditingBug(null)} style={{background:'none', border:'none'}}><X size={24}/></button>
            </div>
            
            <label style={{marginBottom:'5px', fontWeight:'600', display:'block'}}>Title</label>
            <input value={editingBug.title} onChange={e => setEditingBug({...editingBug, title: e.target.value})} style={{marginBottom:'15px'}}/>
            
            <label style={{marginBottom:'5px', fontWeight:'600', display:'block'}}>Description</label>
            <textarea value={editingBug.description} onChange={e => setEditingBug({...editingBug, description: e.target.value})} style={{marginBottom:'15px', minHeight:'80px'}}/>
            
            <div style={{display:'flex', gap:'15px', marginBottom:'20px'}}>
              <div style={{flex:1}}>
                <label style={{marginBottom:'5px', fontWeight:'600', display:'block'}}>Priority</label>
                <select value={editingBug.priority} onChange={e => setEditingBug({...editingBug, priority: e.target.value})}>
                   <option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option>
                </select>
              </div>
              <div style={{flex:1}}>
                <label style={{marginBottom:'5px', fontWeight:'600', display:'block'}}>Status</label>
                <select 
                   value={editingBug.status} 
                   onChange={e => setEditingBug({...editingBug, status: e.target.value})}
                   disabled={!(isAdmin || (currentUserId && (editingBug.createdBy === currentUserId || editingBug.owner === currentUserId)))}
                >
                   <option value="open">Open</option><option value="in-progress">In Progress</option><option value="resolved">Resolved</option>
                </select>
              </div>
            </div>
            <button type="submit" className="btn-primary">Save Changes</button>
          </form>
        </div>
      )}
    </div>
  );
}