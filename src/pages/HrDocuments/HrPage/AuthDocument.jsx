import React from 'react';
import { ErrorMessage, Field } from 'formik';
import { Button, Input, Label, ModalBody, TabContent, TabPane, FormFeedback } from 'reactstrap';




const AuthDocument = ({activeTab, DOCUMENT_TYPES, isPaidDocument, values, currentUser}) => {
    return(
        <ModalBody>
          <TabContent activeTab={activeTab}>
            <TabPane tabId="1">
              <div className="mt-3">
                <div className="mb-3">
                  <Label>დოკუმენტის ტიპი</Label>
                  <Field
                    as="select"
                    name="documentType"
                    className="form-control"
                  >
                    <option value="">აირჩიეთ დოკუმენტის ტიპი</option>
                    {Object.values(DOCUMENT_TYPES).map(type => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage
                    name="documentType"
                    component={FormFeedback}
                  />
                </div>

                {isPaidDocument(values.documentType) && (
                  <>
                    <div className="mb-3">
                      <Label>პირადი ნომერი</Label>
                      <Field
                        type="text"
                        name="id_number"
                        className="form-control"
                        disabled={currentUser?.id_number}
                      />
                      <ErrorMessage
                        name="id_number"
                        component={FormFeedback}
                      />
                    </div>

                    <div className="mb-3">
                      <Label>პოზიცია</Label>
                      <Field
                        type="text"
                        name="position"
                        className="form-control"
                        disabled={currentUser?.position}
                      />
                      <ErrorMessage
                        name="position"
                        component={FormFeedback}
                      />
                    </div>

                    <div className="mb-3">
                      <Label>მიზანი</Label>
                      <Field
                        type="text"
                        name="purpose"
                        className="form-control"
                      />
                      <ErrorMessage
                        name="purpose"
                        component={FormFeedback}
                      />
                    </div>
                  </>
                )}
              </div>
            </TabPane>

          </TabContent>
        </ModalBody>
        
    )
}

export default AuthDocument;