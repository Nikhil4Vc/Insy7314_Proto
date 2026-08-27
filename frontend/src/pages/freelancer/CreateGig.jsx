import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import api from "../../api/api";
import Navbar from "../../components/Navbar";

export default function CreateGig() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      await api.post("/gigs", {
        title,
        description,
        category,
        price: Number(price)
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
          "Unable to create gig."
        );
      }
    } finally {
      setLoading(false);
    }
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

            <h1>Create Gig</h1>

            <p className="page-subtitle">
              Add a new service to the marketplace.
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
                placeholder="e.g. Website Development"
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
                placeholder="Describe the service you provide"
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
                  placeholder="e.g. Web Development"
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
                  placeholder="1500"
                  required
                />
              </div>
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
                disabled={loading}
              >
                {loading
                  ? "Creating..."
                  : "Create Gig"}
              </button>
            </div>
          </form>
        </section>
      </main>
    </>
  );
}