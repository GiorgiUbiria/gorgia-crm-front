import React from 'react';
import { Input, Label, ModalBody, TabContent, TabPane } from 'reactstrap';

const OthersDocument = ({activeTab, users, selectedUserId, setSelectedUserId}) => {
    return(
        <ModalBody>
          <TabContent activeTab={activeTab}>

              <TabPane tabId="2">
                {/* Similar form fields as above but for admin user selection */}
                <div className="mb-3">
                  <Label>მომხმარებელი</Label>
                  <Input
                    type="select"
                    value={selectedUserId}
                    onChange={e => {
                        setSelectedUserId(e.target.value)
                    }}
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
            
          </TabContent>
        </ModalBody>
    )
}

export default OthersDocument;