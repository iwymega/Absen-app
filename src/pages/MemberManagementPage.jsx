import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import Layout from '../components/Layout';

const MemberManagementPage = () => {
  const [members, setMembers] = useState([]);
  const [newName, setNewName] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch members
  const fetchMembers = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('members')
      .select('*')
      .order('name', { ascending: true });

    if (error) {
      console.error('Gagal mengambil data:', error);
    } else {
      setMembers(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  // Add member
  const handleAdd = async () => {
    if (!newName.trim()) return alert('Nama tidak boleh kosong.');
    const { error } = await supabase
      .from('members')
      .insert([{ name: newName }]);
    if (error) {
      alert('Gagal menambahkan anggota.');
      console.error(error);
    } else {
      setNewName('');
      fetchMembers();
    }
  };

  // Delete member
  const handleDelete = async (id) => {
    const confirm = window.confirm('Yakin ingin menghapus anggota ini?');
    if (!confirm) return;
    const { error } = await supabase
      .from('members')
      .delete()
      .eq('id', id);
    if (error) {
      alert('Gagal menghapus.');
      console.error(error);
    } else {
      fetchMembers();
    }
  };

  // Update member
  const handleUpdate = async () => {
    if (!editingName.trim()) return alert('Nama tidak boleh kosong.');
    const { error } = await supabase
      .from('members')
      .update({ name: editingName })
      .eq('id', editingId);
    if (error) {
      alert('Gagal mengupdate.');
      console.error(error);
    } else {
      setEditingId(null);
      setEditingName('');
      fetchMembers();
    }
  };

  return (
    <Layout>
      <h2>Manajemen Anggota</h2>

      <div className="mb-4 d-flex gap-2">
        <input
          type="text"
          className="form-control w-50"
          placeholder="Nama anggota baru"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        />
        <button className="btn btn-primary" onClick={handleAdd}>
          Tambah
        </button>
      </div>

      {loading ? (
        <p>Memuat data...</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Nama</th>
                <th style={{ width: '150px' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {members.map((member) => (
                <tr key={member.id}>
                  <td>
                    {editingId === member.id ? (
                      <input
                        type="text"
                        className="form-control"
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                      />
                    ) : (
                      member.name
                    )}
                  </td>
                  <td>
                    {editingId === member.id ? (
                      <div className="d-flex gap-1">
                        <button className="btn btn-sm btn-success" onClick={handleUpdate}>
                          Simpan
                        </button>
                        <button
                          className="btn btn-sm btn-secondary"
                          onClick={() => {
                            setEditingId(null);
                            setEditingName('');
                          }}
                        >
                          Batal
                        </button>
                      </div>
                    ) : (
                      <div className="d-flex gap-1">
                        <button
                          className="btn btn-sm btn-warning"
                          onClick={() => {
                            setEditingId(member.id);
                            setEditingName(member.name);
                          }}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDelete(member.id)}
                        >
                          Hapus
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
              {members.length === 0 && (
                <tr>
                  <td colSpan="2" className="text-muted text-center">
                    Belum ada anggota.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </Layout>
  );
};

export default MemberManagementPage;
