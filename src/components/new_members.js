import React from 'react';
import { Card } from 'react-bootstrap';

const NewMembers = ({ members }) => {
  return (
    <Card className="p-4 bg-white shadow rounded-lg">
      <h5 className="text-gray-600 text-sm font-medium mb-4">New Members</h5>
      {members.length > 0 ? (
        members.map((member, index) => (
          <div key={index} className="flex items-center mb-4">
            <span className="text-2xl mr-4">😊</span>
            <div>
              <p className="text-gray-800 font-semibold">{member.first_name} {member.last_name}</p>
              <p className="text-gray-600 text-sm">{member.email}</p>
              <p className="text-gray-500 text-xs">{new Date(member.date_joined).toLocaleDateString()}</p>
            </div>
          </div>
        ))
      ) : (
        <p className="text-gray-500 text-sm">No members added yet.</p>
      )}
    </Card>
  );
};

export default NewMembers;
