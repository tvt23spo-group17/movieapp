import React from 'react';
import DeleteAccount from './DeleteAccount';

function Account() {
return (
    <div className="container-sm">
        <h1 className="mb-5">Account</h1>

        <h3 className="mb-3">Account Settings</h3>
        <DeleteAccount />
    </div>
    );
}

export default Account;