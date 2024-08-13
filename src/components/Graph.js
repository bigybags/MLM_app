// Graph.js
import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const Graph = ({ data, options }) => {
  return (
    <div className="p-4 bg-white shadow rounded-lg">
      <div className="flex justify-between items-center text-gray-600 text-sm font-medium mb-2">
        Joinings
        <div>
          <button className="mx-1 text-blue-500">Year</button>
          <button className="mx-1 text-gray-500">Month</button>
          <button className="mx-1 text-gray-500">Day</button>
        </div>
      </div>
      <Line data={data} options={options} />
    </div>
  );
};

export default Graph;
