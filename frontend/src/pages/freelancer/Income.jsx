import {
  useEffect,
  useState
} from "react";

import api from "../../api/api";
import Navbar from "../../components/Navbar";
import PageContainer from "../../components/PageContainer";

export default function Income() {
  const [income, setIncome] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadIncome() {
      try {
        const response = await api.get(
          "/bookings/income"
        );

        setIncome(response.data);
      } catch (requestError) {
        setError(
          requestError.response?.data?.message ||
            "Unable to load income."
        );
      } finally {
        setLoading(false);
      }
    }

    loadIncome();
  }, []);

  return (
    <>
      <Navbar />

      <PageContainer>
        <section className="page-header">
          <h1>Income</h1>

          <p className="page-subtitle">
            Review your earnings and completed
            transactions.
          </p>
        </section>

        {loading && (
          <p>Loading income...</p>
        )}

        {error && (
          <div
            className="error-message"
            role="alert"
          >
            {error}
          </div>
        )}

        {!loading && !error && income && (
          <>
            <div className="income-summary">
              <section className="card summary-card">
                <span className="meta-label">
                  Total Income
                </span>

                <strong className="summary-value">
                  R{income.totalIncome}
                </strong>
              </section>

              <section className="card summary-card">
                <span className="meta-label">
                  Completed Transactions
                </span>

                <strong className="summary-value">
                  {income.transactionCount}
                </strong>
              </section>
            </div>

            <section className="section-header">
              <div>
                <h2>Transactions</h2>

                <p>
                  Your completed booking payments.
                </p>
              </div>
            </section>

            {income.transactions.length === 0 ? (
              <div className="empty-state">
                <h2>No transactions yet</h2>

                <p>
                  Completed payments will appear
                  here.
                </p>
              </div>
            ) : (
              <div className="transaction-list">
                {income.transactions.map(
                  (transaction) => (
                    <article
                      className="card transaction-card"
                      key={transaction._id}
                    >
                      <div className="transaction-main">
                        <div>
                          <span className="meta-label">
                            Payment
                          </span>

                          <h3>
                            R{transaction.amount}
                          </h3>
                        </div>

                        <span
                          className={`status-badge status-${transaction.status}`}
                        >
                          {transaction.status}
                        </span>
                      </div>

                      <div className="transaction-details">
                        <div>
                          <span className="meta-label">
                            Type
                          </span>

                         <p>
  {transaction.type === "booking_payment"
    ? "Booking Payment"
    : transaction.type}
</p>
                        </div>

                        <div>
                          <span className="meta-label">
                            Date
                          </span>

                          <p>
                            {new Date(
                              transaction.createdAt
                            ).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </article>
                  )
                )}
              </div>
            )}
          </>
        )}
      </PageContainer>
    </>
  );
}