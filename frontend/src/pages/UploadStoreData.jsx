import DashboardLayout from "../layouts/DashboardLayout.jsx";

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
      <div className="p-6 min-h-screen">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-7">
            <h1 className="text-2xl font-semibold mb-2">
              Dataset Information
            </h1>
            <p className="text-[var(--text-muted)]">
              Details about the data powering these predictions
            </p>
          </div>

          {/* Current Dataset */}
          <div className="card-premium mb-6">
            <h2 className="font-semibold mb-4">Current Dataset</h2>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-[var(--accent-primary)] rounded-full mt-2"></div>
                <div>
                  <p className="text-[var(--text-main)]">
                    <strong>UCI Online Retail Dataset</strong> - A real-world transactional dataset from a UK-based online retailer
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-[var(--accent-primary)] rounded-full mt-2"></div>
                <div>
                  <p className="text-[var(--text-main)]">
                    <strong>Source:</strong>{" "}
                    <a
                      href="https://archive.ics.uci.edu/dataset/352/online+retail"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[var(--accent-primary)] hover:text-[var(--accent-hover)] underline"
                    >
                      UCI Machine Learning Repository
                    </a>
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-[var(--accent-primary)] rounded-full mt-2"></div>
                <div>
                  <p className="text-[var(--text-main)]">
                    <strong>Contains:</strong> Transactions from December 2010 to December 2011 for a non-store online retailer
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-[var(--accent-primary)] rounded-full mt-2"></div>
                <div>
                  <p className="text-[var(--text-main)]">
                    <strong>Size:</strong> Over 500,000 transactions with 8 key variables
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Dataset Structure */}
          <div className="card-premium mb-6">
            <h2 className="font-semibold mb-4">Dataset Structure</h2>
            <p className="text-sm text-[var(--text-muted)] mb-4">
              Each record contains the following fields:
            </p>

            <div className="space-y-3">
              {datasetFields.map((field, idx) => (
                <div
                  key={idx}
                  className="bg-[var(--bg-secondary)] rounded-lg p-4 border border-[var(--border-subtle)]"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-medium text-[var(--text-main)]">{field.name}</h3>
                    <span className="text-xs bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] px-2 py-1 rounded border border-[var(--accent-primary)]/20">
                      {field.type}
                    </span>
                  </div>
                  <p className="text-sm text-[var(--text-muted)]">{field.description}</p>
                </div>
              ))}
            </div>
          </div>


          {/* Future Feature */}
          <div className="card-premium border-indigo-500/30">
            <div className="flex items-start gap-3 mb-3">
              <span className="text-2xl"></span>
              <div>
                <h2 className="font-semibold text-[var(--text-main)] mb-1">Upcoming Feature: Custom Dataset Upload</h2>
                <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                  As part of our college project, we are implementing a feature that will allow users to upload their own datasets and receive detailed analyses.
                  The system will automatically examine the structure of the uploaded data and apply relevant machine learning models to generate actionable insights.
                  This functionality aims to empower users to make data-driven decisions using their own data in a seamless and intuitive way.
                </p>
              </div>
            </div>
          </div>


          {/* Models Used */}
          <div className="mt-6 card-premium">
            <h2 className="font-semibold mb-4">Machine Learning Models</h2>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-[var(--accent-primary)] rounded-full mt-2"></div>
                <div>
                  <p className="text-[var(--text-main)]">
                    <strong>Decision Tree</strong> - Used for customer spend predictions based on purchase history
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-[var(--accent-primary)] rounded-full mt-2"></div>
                <div>
                  <p className="text-[var(--text-main)]">
                    <strong>K-Nearest Neighbors (KNN)</strong> - Powers the product similarity recommendations
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-[var(--accent-primary)] rounded-full mt-2"></div>
                <div>
                  <p className="text-[var(--text-main)]">
                    <strong>Time Series Analysis</strong> - Identifies peak sales patterns by hour, day, and month
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-[var(--accent-primary)] rounded-full mt-2"></div>
                <div>
                  <p className="text-[var(--text-main)]">
                    <strong>K-Means Clustering</strong> - Groups similar customers or products for segmentation and targeted marketing
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-[var(--accent-primary)] rounded-full mt-2"></div>
                <div>
                  <p className="text-[var(--text-main)]">
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