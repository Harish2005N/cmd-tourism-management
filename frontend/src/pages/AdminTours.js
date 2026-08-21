// ============================================================
 // pages/AdminTours.js - Add, Edit, Delete tours (Multiple Images Support)
 // ============================================================

import React, { useEffect, useState } from 'react';
import API from '../context/api';

// Empty form template
const emptyForm = {
  name: '', destination: '', price: '', duration: '',
  description: '', availableSeats: '', images: '',
  itinerary: '',
};

function AdminTours() {
  const [tours, setTours]         = useState([]);
  const [form, setForm]           = useState(emptyForm);
  const [editId, setEditId]       = useState(null);   // null = add mode, id = edit mode
  const [showForm, setShowForm]   = useState(false);
  const [loading, setLoading]     = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage]     = useState('');

  const fetchTours = () => {
    API.get('/tours/all')
      .then((res) => setTours(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchTours(); }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  // Open form for adding a new tour
  const handleAdd = () => {
    setForm(emptyForm);
    setEditId(null);
    setShowForm(true);
  };

  // Open form pre-filled for editing
  const handleEdit = (tour) => {
    setForm({
      name: tour.name, destination: tour.destination,
      price: tour.price, duration: tour.duration,
      description: tour.description, availableSeats: tour.availableSeats,
      images: JSON.stringify(tour.images || []),
      itinerary: JSON.stringify(tour.itinerary || []),
    });
    setEditId(tour._id);
    setShowForm(true);
    window.scrollTo(0, 0);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this tour permanently?')) return;
    try {
      await API.delete(`/tours/${id}`);
      setMessage('Tour deleted.');
      fetchTours();
    } catch (err) {
      setMessage('Delete failed: ' + (err.response?.data?.message || ''));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage('');
    try {
      const submitData = {
        ...form,
        images: form.images ? JSON.parse(form.images) : [],
        itinerary: form.itinerary ? JSON.parse(form.itinerary) : [],
        price: Number(form.price),
        duration: Number(form.duration),
        availableSeats: Number(form.availableSeats),
      };
      if (editId) {
        await API.put(`/tours/${editId}`, submitData);
        setMessage('✅ Tour updated successfully!');
      } else {
        await API.post('/tours', submitData);
        setMessage('✅ Tour added successfully!');
      }
      setShowForm(false);
      setForm(emptyForm);
      setEditId(null);
      fetchTours();
    } catch (err) {
      setMessage('❌ Error: ' + (err.response?.data?.message || 'Something went wrong'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <div className="container d-flex justify-content-between align-items-center">
          <div>
            <h1 className="fw-bold"><i className="bi bi-map me-2"></i>Manage Tours</h1>
            <p className="lead mb-0">Add, edit, or remove tour packages</p>
          </div>
          <button className="btn btn-light btn-lg" onClick={handleAdd}>
            <i className="bi bi-plus-lg me-2"></i>Add Tour
          </button>
        </div>
      </div>

      <div className="container pb-5">
        {message && (
          <div className={`alert ${message.startsWith('✅') ? 'alert-success' : 'alert-danger'} alert-dismissible`}>
            {message}
            <button type="button" className="btn-close" onClick={() => setMessage('')}></button>
          </div>
        )}

        {/* Add / Edit Form */}
        {showForm && (
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-header bg-primary text-white">
              <h5 className="mb-0">{editId ? 'Edit Tour' : 'Add New Tour'}</h5>
            </div>
            <div className="card-body p-4">
              <form onSubmit={handleSubmit}>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Tour Name *</label>
                    <input name="name" className="form-control" value={form.name} onChange={handleChange} required />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Destination *</label>
                    <input name="destination" className="form-control" value={form.destination} onChange={handleChange} required />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label fw-semibold">Price (₹) *</label>
                    <input type="number" name="price" className="form-control" value={form.price} onChange={handleChange} required min="0" />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label fw-semibold">Duration (days) *</label>
                    <input type="number" name="duration" className="form-control" value={form.duration} onChange={handleChange} required min="1" />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label fw-semibold">Available Seats *</label>
                    <input type="number" name="availableSeats" className="form-control" value={form.availableSeats} onChange={handleChange} required min="0" />
                  </div>
                  <div className="col-12">
                    <label className="form-label fw-semibold">Description *</label>
                    <textarea name="description" className="form-control" rows="3" value={form.description} onChange={handleChange} required></textarea>
                  </div>
                  <div className="col-12">
                    <label className="form-label fw-semibold">Images URLs (JSON array)</label>
                    <small className="text-muted d-block mb-2">{`["https://example.com/img1.jpg", "https://example.com/img2.jpg"]`} - Copy example</small>
                    <textarea 
                      name="images" 
                      className="form-control" 
                      rows="4" 
                      value={form.images} 
                      onChange={handleChange}
                      placeholder='["https://images.unsplash.com/photo1.jpg", "https://images.unsplash.com/photo2.jpg"]'
                    />
                    <div className="mt-2">
                      <small className="text-muted">Use Unsplash, Pexels, or your hosted images</small>
                    </div>
                  </div>
                  <div className="col-12">
                    <label className="form-label fw-semibold">Tour Plan / Itinerary (JSON)</label>
                    <small className="text-muted d-block mb-2">{`[{"day":1,"location":"Delhi","activities":"India Gate"}]`} - Copy example</small>
                    <textarea 
                      name="itinerary" 
                      className="form-control" 
                      rows="6" 
                      value={form.itinerary} 
                      onChange={handleChange}
                      placeholder='[{"day":1,"location":"City","activities":"Description"}]'
                    />
                  </div>
                  {/* Images Preview */}
                  {form.images && (
                    <div className="col-12 mt-3">
                      <label className="form-label fw-semibold">Images Preview:</label>
                      <div className="d-flex gap-2 flex-wrap">
                        {(() => {
                          try {
                            const images = JSON.parse(form.images);
                            return images.map((imgUrl, index) => (
                              <img key={index} src={imgUrl} alt={`Preview ${index + 1}`} 
                                   className="rounded shadow-sm" style={{width: '100px', height: '75px', objectFit: 'cover'}}
                                   onError={(e) => e.target.style.display = 'none'} />
                            ));
                          } catch {
                            return <small className="text-warning">Invalid JSON - Fix format</small>;
                          }
                        })()}
                      </div>
                    </div>
                  )}
                </div>
                <div className="d-flex gap-2 mt-4">
                  <button type="submit" className="btn btn-primary" disabled={submitting}>
                    {submitting ? <span className="spinner-border spinner-border-sm me-2"></span> : null}
                    {editId ? 'Update Tour' : 'Add Tour'}
                  </button>
                  <button type="button" className="btn btn-outline-secondary" onClick={() => setShowForm(false)}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Tours Table */}
        {loading ? (
          <div className="text-center py-4"><div className="spinner-border text-primary"></div></div>
        ) : (
          <div className="card border-0 shadow-sm">
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="table-light">
                  <tr>
                    <th>#</th><th>Name</th><th>Destination</th>
                    <th>Price</th><th>Duration</th><th>Seats</th><th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {tours.length === 0 ? (
                    <tr><td colSpan="7" className="text-center text-muted py-4">No tours yet. Add one!</td></tr>
                  ) : tours.map((tour, i) => (
                    <tr key={tour._id}>
                      <td>{i + 1}</td>
                      <td className="fw-semibold">{tour.name}</td>
                      <td><i className="bi bi-geo-alt text-danger me-1"></i>{tour.destination}</td>
                      <td>₹{tour.price?.toLocaleString()}</td>
                      <td>{tour.duration} days</td>
                      <td>
                        <span className={`badge ${tour.availableSeats > 0 ? 'bg-success' : 'bg-danger'}`}>
                          {tour.availableSeats}
                        </span>
                      </td>
                      <td>
                        <button className="btn btn-sm btn-outline-primary me-2" onClick={() => handleEdit(tour)}>
                          <i className="bi bi-pencil"></i>
                        </button>
                        <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(tour._id)}>
                          <i className="bi bi-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminTours;

