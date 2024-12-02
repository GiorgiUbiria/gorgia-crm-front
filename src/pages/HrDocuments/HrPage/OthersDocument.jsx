import React, { useState } from 'react';
import { Input, Label, TabPane } from 'reactstrap';
import useFetchUsers from 'hooks/useFetchUsers';

const OthersDocument = () => {
    const [selectedUserId, setSelectedUserId] = useState("")
    const { users, loading: usersLoading, error: usersError } = useFetchUsers()
    return(
        <TabPane tabId="2">
                      {/* Similar form fields as above but for admin user selection */}
                      <div className="mb-3">
                        <Label>მომხმარებელი</Label>
                        <Input
                          type="select"
                          value={selectedUserId}
                          onChange={e => setSelectedUserId(e.target.value)}
                        >
                          <option value="">აირჩიეთ მომხმარებელი</option>
                          {users.map(user => (
                            <option key={user.id} value={user.id}>
                              {user.name} (ID: {user.id_number})
                            </option>
                          ))}
                        </Input>
                      </div>
                      {/* Rest of the form fields similar to TabPane "1" */}
                    </TabPane>
    )
}

export default OthersDocument;