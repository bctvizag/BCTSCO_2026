import React, { useState } from 'react';
import SearchBox from '../components/SearchBox';
import TabularSearchBox from '../components/TabularSearchBox';
import ComboSearchBox from '../components/ComboSearchBox';
import MemberResults from '../components/MemberResults';
import { members, Member } from '../data';

const MembersPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [memberResults, setMemberResults] = useState<Member[]>([]);

  const handleMemberSearch = (query: string, results: Member[]) => {
    setSearchQuery(query);
    setMemberResults(results);
  };

  return (
    <>
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Original SearchBox</h3>
        <SearchBox<Member>
          items={members}
          onSearch={handleMemberSearch}
          placeholder="Search for members..."
          searchFields={['Name', 'Rank', 'MEMID', 'GNO']}
          displayFields={['Name', 'MEMID', 'Rank']}
          valueField="Name"
          highlightField="Name"
          rightField="GNO"
          rightFieldLabel="GNO"
        />
      </div>
      
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">New Tabular SearchBox</h3>
        <TabularSearchBox<Member>
          items={members}
          onSearch={handleMemberSearch}
          placeholder="Search for members..."
          searchFields={['Name', 'Rank', 'MEMID', 'GNO']}
          displayFields={['MEMID', 'Name', 'Rank', 'GNO']}
          fieldLabels={{
            'MEMID': 'Member ID',
            'Name': 'Full Name',
            'Rank': 'Rank',
            'GNO': 'Government Number'
          }}
          valueField="Name"
          highlightField="Name"
          resizable={true}
          minHeight={200}
          maxHeight={500}
          showResultsCount={true}
        />
      </div>
      
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Combo SearchBox (Select-style)</h3>
        <ComboSearchBox<Member>
          items={members}
          onSearch={handleMemberSearch}
          onSelect={(item) => {
            console.log('Selected member:', item);
            handleMemberSearch(item.Name, [item]);
          }}
          placeholder="Select or search for members..."
          searchFields={['Name', 'Rank', 'MEMID', 'GNO']}
          displayFields={['MEMID', 'Name', 'Rank', 'GNO']}
          fieldLabels={{
            'MEMID': 'Member ID',
            'Name': 'Full Name',
            'Rank': 'Rank',
            'GNO': 'Government Number'
          }}
          valueField="Name"
          highlightField="Name"
          showResultsCount={true}
        />
      </div>
      
      <MemberResults 
        members={memberResults} 
        searchQuery={searchQuery} 
      />
    </>
  )
  
};

export default MembersPage;