import React from 'react';
import HeadingRoom from './headingRoom';
import MembersRoom from './membersRoom';

const TopHeader = () => {
    return (
        <div className="flex justify-between items-center mb-6">
            <HeadingRoom />
            <MembersRoom />
        </div>
    );
}

export default TopHeader;
