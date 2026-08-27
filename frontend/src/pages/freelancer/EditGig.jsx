import { useEffect, useState } from "react";
import {
  Link,
  useNavigate,
  useParams
} from "react-router-dom";

import api from "../../api/api";
import Navbar from "../../components/Navbar";

export default function EditGig() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [isActive, setIsActive] = useState(true);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadGig() {
      try {
        const response = await api.get(`/gigs/${id}`);
        const gig = response.data.gig;

        setTitle(gig.title);
        setDescription(gig.description);
        setCategory(gig.category);
        setPrice(gig.price);
        setIsActive(gig.isActive);
      } catch (requestError) {
        setError(
          requestError.response?.data?.message ||
          "Unable to load gig."
        );
      } finally {
        setLoading(false);
      }
    }

    loadGig();
  }, [id]);

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setSaving(true);

    try {
      await api.put(`/gigs/${id}`, {
        title,
        description,
        category,
        price: Number(price),
        isActive
      });

      navigate("/freelancer/gigs");
    } catch (requestError) {
      const response = requestError.response?.data;

      if (response?.errors?.length > 0) {
        setError(
          response.errors
            .map((item) => item.message)
            .join(" ")
        );
      } else {
        setError(
          response?.message ||
          "Unable to update gig."
        );
      }
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <>
        <Navbar />

        <main className="page-container">
          <p>Loading gig...</p>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main className="page-container">
        <section className="page-header">
          <div>
            <Link
              className="back-link"
              to="/freelancer/gigs"
            >
              ← Back to My Gigs
            </Link>

            <h1>Edit Gig</h1>

            <p className="page-subtitle">
              Update your service details and
              availability.
            </p>
          </div>
        </section>

        <section className="card form-card">
          <form
            className="gig-form"
            onSubmit={handleSubmit}
          >
            <div className="form-group">
              <label htmlFor="title">
                Title
              </label>

              <input
                id="title"
                type="text"
                value={title}
                onChange={(event) =>
                  setTitle(event.target.value)
                }
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">
                Description
              </label>

              <textarea
                id="description"
                value={description}
                onChange={(event) =>
                  setDescription(event.target.value)
                }
                rows="5"
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="category">
                  Category
                </label>

                <input
                  id="category"
                  type="text"
                  value={category}
                  onChange={(event) =>
                    setCategory(event.target.value)
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="price">
                  Price (R)
                </label>

                <input
                  id="price"
                  type="number"
                  min="1"
                  value={price}
                  onChange={(event) =>
                    setPrice(event.target.value)
                  }
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="checkbox-row">
                <input
                  id="isActive"
                  type="checkbox"
                  checked={isActive}
                  onChange={(event) =>
                    setIsActive(event.target.checked)
                  }
                />

                <span>
                  <strong>Active Gig</strong>
                  <small>
                    Visible to clients in the
                    marketplace
                  </small>
                </span>
              </label>
            </div>

            {error && (
              <p
                className="error-message"
                role="alert"
              >
                {error}
              </p>
            )}

            <div className="form-actions">
              <Link
                className="button button-secondary"
                to="/freelancer/gigs"
              >
                Cancel
              </Link>

              <button
                className="button button-primary"
                type="submit"
                disabled={saving}
              >
                {saving
                  ? "Saving..."
                  : "Save Changes"}
              </button>
            </div>
          </form>
        </section>
      </main>
    </>
  );
}