import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

// Warm palette colors matching the app's theme, one per expense category
const CATEGORY_COLORS = {
  Hotel: "#C1673F",
  Food: "#9C4A2B",
  Transport: "#8A7B6C",
  Activities: "#7A8C6F",
  Shopping: "#D9A86C",
  Other: "#B9A88F",
};

// Pie chart showing how expenses are distributed across categories
const ExpenseChart = ({ expenses }) => {
  const totalsByCategory = {};

  expenses.forEach((expense) => {
    totalsByCategory[expense.category] = (totalsByCategory[expense.category] || 0) + expense.amount;
  });

  const labels = Object.keys(totalsByCategory);

  if (labels.length === 0) {
    return (
      <div className="card font-body text-sm text-taupe">
        Add an expense to see your spending breakdown.
      </div>
    );
  }

  const data = {
    labels,
    datasets: [
      {
        data: labels.map((label) => totalsByCategory[label]),
        backgroundColor: labels.map((label) => CATEGORY_COLORS[label] || "#B9A88F"),
        borderColor: "#F7F1E8",
        borderWidth: 2,
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          font: { family: "Source Sans 3" },
          color: "#2E2620",
        },
      },
    },
  };

  return (
    <div className="card">
      <h4 className="font-display text-lg text-ink mb-4">Expense Breakdown</h4>
      <Pie data={data} options={options} />
    </div>
  );
};

export default ExpenseChart;
