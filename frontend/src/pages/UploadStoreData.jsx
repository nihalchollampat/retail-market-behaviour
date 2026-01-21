import DashboardLayout from "../layouts/DashboardLayout.jsx";
import "./UploadStoreData.css";

export default function DatasetInfoPage() {
  const datasetFields = [
    {
      name: "InvoiceNo",
      type: "Categorical",
      description: "A 6-digit number uniquely assigned to each transaction. If it starts with 'c', it indicates a cancellation"
    },
    {
      name: "StockCode",
      type: "Categorical",
      description: "A 5-digit number uniquely assigned to each distinct product"
    },
    {
      name: "Description",
      type: "Categorical",
      description: "Product name"
    },
    {
      name: "Quantity",
      type: "Integer",
      description: "The quantities of each product per transaction"
    },
    {
      name: "InvoiceDate",
      type: "Date",
      description: "The day and time when each transaction was generated"
    },
    {
      name: "UnitPrice",
      type: "Continuous",
      description: "Product price per unit (in sterling)"
    },
    {
      name: "CustomerID",
      type: "Categorical",
      description: "A 5-digit number uniquely assigned to each customer"
    },
    {
      name: "Country",
      type: "Categorical",
      description: "The name of the country where each customer resides"
    }
  ];

  return (
    <DashboardLayout>
      <div className="upload-page">
        <div className="upload-container">
          {/* Header */}
          <div className="upload-header">
            <h1 className="upload-title">
              Dataset Information
            </h1>
            <p className="upload-subtitle">
              Details about the data powering these predictions
            </p>
          </div>

          {/* Current Dataset */}
          <div className="card-premium upload-section">
            <h2 className="upload-section-title">Current Dataset</h2>

            <div className="upload-info-list">
              <div className="upload-info-item">
                <div className="upload-bullet"></div>
                <div>
                  <p className="upload-info-text">
                    <strong>UCI Online Retail Dataset</strong> - A real-world transactional dataset from a UK-based online retailer
                  </p>
                </div>
              </div>

              <div className="upload-info-item">
                <div className="upload-bullet"></div>
                <div>
                  <p className="upload-info-text">
                    <strong>Source:</strong>{" "}
                    <a
                      href="https://archive.ics.uci.edu/dataset/352/online+retail"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="upload-link"
                    >
                      UCI Machine Learning Repository
                    </a>
                  </p>
                </div>
              </div>

              <div className="upload-info-item">
                <div className="upload-bullet"></div>
                <div>
                  <p className="upload-info-text">
                    <strong>Contains:</strong> Transactions from December 2010 to December 2011 for a non-store online retailer
                  </p>
                </div>
              </div>

              <div className="upload-info-item">
                <div className="upload-bullet"></div>
                <div>
                  <p className="upload-info-text">
                    <strong>Size:</strong> Over 500,000 transactions with 8 key variables
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Dataset Structure */}
          <div className="card-premium upload-section">
            <h2 className="upload-section-title">Dataset Structure</h2>
            <p className="upload-fields-desc">
              Each record contains the following fields:
            </p>

            <div className="upload-fields-grid">
              {datasetFields.map((field, idx) => (
                <div
                  key={idx}
                  className="upload-field-card"
                >
                  <div className="upload-field-header">
                    <h3 className="upload-field-name">{field.name}</h3>
                    <span className="upload-field-type">
                      {field.type}
                    </span>
                  </div>
                  <p className="upload-field-desc">{field.description}</p>
                </div>
              ))}
            </div>
          </div>


          {/* Future Feature */}
          <div className="card-premium upload-future-feature">
            <div className="upload-future-content">
              <div>
                <h2 className="upload-future-title">Upcoming Feature: Custom Dataset Upload</h2>
                <p className="upload-future-text">
                  As part of our college project, we are implementing a feature that will allow users to upload their own datasets and receive detailed analyses.
                  The system will automatically examine the structure of the uploaded data and apply relevant machine learning models to generate actionable insights.
                  This functionality aims to empower users to make data-driven decisions using their own data in a seamless and intuitive way.
                </p>
              </div>
            </div>
          </div>


          {/* Models Used */}
          <div className="card-premium upload-models-section">
            <h2 className="upload-section-title">Machine Learning Models</h2>
            <div className="upload-info-list">
              <div className="upload-info-item">
                <div className="upload-bullet"></div>
                <div>
                  <p className="upload-info-text">
                    <strong>Decision Tree</strong> - Used for customer spend predictions based on purchase history
                  </p>
                </div>
              </div>

              <div className="upload-info-item">
                <div className="upload-bullet"></div>
                <div>
                  <p className="upload-info-text">
                    <strong>K-Nearest Neighbors (KNN)</strong> - Powers the product similarity recommendations
                  </p>
                </div>
              </div>

              <div className="upload-info-item">
                <div className="upload-bullet"></div>
                <div>
                  <p className="upload-info-text">
                    <strong>Time Series Analysis</strong> - Identifies peak sales patterns by hour, day, and month
                  </p>
                </div>
              </div>

              <div className="upload-info-item">
                <div className="upload-bullet"></div>
                <div>
                  <p className="upload-info-text">
                    <strong>K-Means Clustering</strong> - Groups similar customers or products for segmentation and targeted marketing
                  </p>
                </div>
              </div>

              <div className="upload-info-item">
                <div className="upload-bullet"></div>
                <div>
                  <p className="upload-info-text">
                    <strong>Principal Component Analysis (PCA)</strong> - Reduces dimensionality of data for easier visualization and faster model training
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
}