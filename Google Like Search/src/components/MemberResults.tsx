import React from 'react';
import { Member } from '../data';

interface MemberResultsProps {
  members: Member[];
  searchQuery: string;
}

const MemberResults: React.FC<MemberResultsProps> = ({ members, searchQuery }) => {
  if (!members.length) {
    return (
      <div className="mt-8 text-center text-gray-500">
        {searchQuery ? 'No members found matching your search.' : 'Enter a search term to find members.'}
      </div>
    );
  }

  return (
    <div className="mt-8">
      <h2 className="mb-4 text-xl font-semibold text-gray-800">
        {members.length} {members.length === 1 ? 'Result' : 'Results'} {searchQuery && `for "${searchQuery}"`}
      </h2>
      
      <div className="overflow-hidden bg-white shadow-md rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                MEMID
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rank
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                GNO
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {members.map((member) => (
              <tr key={member.MEMID} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {member.MEMID}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {member.Name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    member.Rank === 'DGP' || member.Rank === 'IGP' || member.Rank === 'DIG'
                      ? 'bg-purple-100 text-purple-800' 
                      : member.Rank === 'GC' || member.Rank === 'SQCOM'
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-green-100 text-green-800'
                  }`}>
                    {member.Rank}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {member.GNO}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MemberResults;