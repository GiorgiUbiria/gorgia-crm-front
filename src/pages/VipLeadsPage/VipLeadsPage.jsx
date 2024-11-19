import React, { useEffect, useState, useMemo } from 'react';
import {
  Card,
  CardBody,
  Col,
  Container,
  Row,
  Modal,
  ModalHeader,
  ModalBody,
  Label,
  Input,
  Form,
  FormGroup,
  Button,
} from 'reactstrap';
import { useTable, usePagination, useSortBy } from 'react-table';
import { Link } from 'react-router-dom';
import DeleteModal from 'components/Common/DeleteModal';
import { getVipLeads, createVipLead, updateVipLead, deleteVipLead } from '../../services/vipLeadsService';
import Breadcrumbs from 'components/Common/Breadcrumb';
import moment from 'moment';  // Import moment.js for formatting dates

const VipLeadsPage = () => {
  const [vipLeads, setVipLeads] = useState([]);
  const [vipLead, setVipLead] = useState(null);
  const [isEdit, setIsEdit] = useState(false);
  const [modal, setModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);

  // Fetch VIP leads from the server
  const fetchVipLeads = async () => {
    try {
      const response = await getVipLeads();
      console.log(response);
      setVipLeads(response || []);
    } catch (error) {
      console.error('Error fetching VIP leads:', error);
      setVipLeads([]);
    }
  };

  useEffect(() => {
    fetchVipLeads();
  }, []);

  // Handle status change directly from the table
  const handleStatusChange = async (leadId, newStatus) => {
    const leadToUpdate = vipLeads.find((lead) => lead.id === leadId);
    const updatedLead = { ...leadToUpdate, status: newStatus };
    try {
      await updateVipLead(leadId, updatedLead);
      fetchVipLeads();
    } catch (error) {
      console.error('Error updating lead status:', error);
    }
  };

  // Define table columns and actions, including the status dropdown
  const columns = useMemo(
    () => [
      { Header: 'სახელი', accessor: 'first_name' },
      { Header: 'გვარი', accessor: 'last_name' },
      { Header: 'ტელეფონის ნომერი', accessor: 'mobile_number' },
      { Header: 'პასუხისმგებელი პირი', accessor: 'responsible_person' },
      {
        Header: 'სტატუსი',
        accessor: 'status',
        Cell: ({ row }) => (
          <Input
            type="select"
            value={row.original.status}
            onChange={(e) => handleStatusChange(row.original.id, e.target.value)}
          >
            <option value="Active">აქტიური</option>
            <option value="Closed">დახურული</option>
            <option value="Problem">პრობლემური</option>
          </Input>
        ),
      },
      { Header: 'მოთხოვნა', accessor: 'request' },
      {
        Header: ({ sorted, sortedDesc }) => (
          <div>
            თარიღი
            <span>
              {' ▼'}
            </span>
          </div>
        ),
        accessor: 'created_at',
        Cell: ({ value }) => moment(value).format('YYYY-MM-DD'),
      },
      {
        Header: 'მოქმედება',
        id: 'actions',
        Cell: ({ row }) => (
          <div className="d-flex gap-2">
            <Button color="primary" onClick={() => handleEditClick(row.original)}>
              რედაქტირება
            </Button>
            <Button color="danger" onClick={() => handleDeleteClick(row.original)}>
              წაშლა
            </Button>
            <Link to={`/vip-leads/${row.original.id}`}>
              <Button color="info">კომენტარები</Button> {/* Link to the detail page */}
            </Link>
          </div>
        ),
      },
    ],
    [vipLeads]
  );

  // Initialize table with pagination and sorting
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable(
    {
      columns,
      data: vipLeads,
      initialState: {
        sortBy: [
          {
            id: 'created_at',
            desc: true // true for descending order (newest first)
          }
        ]
      }
    },
    useSortBy,
    usePagination
  );

  // Open modal for adding new VIP lead
  const handleAddClick = () => {
    setVipLead(null);
    setIsEdit(false);
    setModal(true);
  };

  // Open modal for editing an existing VIP lead
  const handleEditClick = (leadData) => {
    setVipLead(leadData);
    setIsEdit(true);
    setModal(true);
  };

  // Handle deletion of a VIP lead
  const handleDeleteClick = (leadData) => {
    setVipLead(leadData);
    setDeleteModal(true);
  };

  const handleDeleteVipLead = async () => {
    try {
      await deleteVipLead(vipLead.id);
      fetchVipLeads();
      setDeleteModal(false);
    } catch (error) {
      console.error('Error deleting VIP lead:', error);
    }
  };

  // Save new or edited VIP lead
  const handleSaveVipLead = async (event) => {
    event.preventDefault();
    const data = new FormData(event.target);
    const leadData = {
      first_name: data.get('first_name'),
      last_name: data.get('last_name'),
      request: data.get('request'),
      responsible_person: data.get('responsible_person'),
      status: data.get('status'),
      comment: data.get('comment'),
    };

    try {
      if (isEdit) {
        await updateVipLead(vipLead.id, leadData);
      } else {
        await createVipLead(leadData);
      }
      fetchVipLeads();
      setModal(false);
    } catch (error) {
      console.error('Error saving VIP lead:', error);
    }
  };

  return (
    <React.Fragment>
      <DeleteModal
        show={deleteModal}
        onDeleteClick={handleDeleteVipLead}
        onCloseClick={() => setDeleteModal(false)}
      />
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="ლიდები" breadcrumbItem="VIP" />
          <Row className="mb-3">
            <Col style={{ textAlign: 'right' }}>
              <Button
                color="success"
                className="btn-rounded waves-effect waves-light mb-2"
                onClick={handleAddClick}
              >
                დამატება
              </Button>
            </Col>
          </Row>
          <Row>
            <Col lg="12">
              <Card>
                <CardBody>
                  <table {...getTableProps()} className="table">
                    <thead>
                      {headerGroups.map((headerGroup) => (
                        <tr {...headerGroup.getHeaderGroupProps()} key={headerGroup.id}>
                          {headerGroup.headers.map((column) => (
                            <th 
                              {...column.getHeaderProps(column.getSortByToggleProps())} 
                              key={column.id}
                              style={{ verticalAlign: 'middle' }}
                            >
                              {column.id === 'created_at' 
                                ? column.render('Header')
                                : column.render('Header').props?.children || column.render('Header')}
                            </th>
                          ))}
                        </tr>
                      ))}
                    </thead>
                    <tbody {...getTableBodyProps()}>
                      {rows.map((row) => {
                        prepareRow(row);
                        return (
                          <tr {...row.getRowProps()} key={row.id}>
                            {row.cells.map((cell) => (
                              <td 
                                {...cell.getCellProps()} 
                                key={cell.column.id}
                                style={{ verticalAlign: 'middle' }}
                              >
                                {cell.render('Cell')}
                              </td>
                            ))}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </CardBody>
              </Card>
            </Col>
          </Row>
          <Modal isOpen={modal} toggle={() => setModal(!modal)}>
            <ModalHeader toggle={() => setModal(!modal)}>
              {isEdit ? 'განახლება' : 'დამატება'}
            </ModalHeader>
            <ModalBody>
              <Form onSubmit={handleSaveVipLead}>
                <FormGroup>
                  <Label for="first_name">სახელი</Label>
                  <Input
                    id="first_name"
                    name="first_name"
                    defaultValue={vipLead ? vipLead.first_name : ''}
                    required
                  />
                </FormGroup>
                <FormGroup>
                  <Label for="last_name">გვარი</Label>
                  <Input
                    id="last_name"
                    name="last_name"
                    defaultValue={vipLead ? vipLead.last_name : ''}
                    required
                  />
                </FormGroup>
                <FormGroup>
                  <Label for="request">მოთხოვნა</Label>
                  <Input
                    id="request"
                    name="request"
                    defaultValue={vipLead ? vipLead.request : ''}
                    required
                  />
                </FormGroup>
                <FormGroup>
                  <Label for="responsible_person">პასუხისმგებელი პირი</Label>
                  <Input
                    id="responsible_person"
                    name="responsible_person"
                    defaultValue={vipLead ? vipLead.responsible_person : ''}
                    required
                  />
                </FormGroup>
                <FormGroup>
                  <Label for="status">სტატუსი</Label>
                  <Input
                    type="select"
                    name="status"
                    defaultValue={vipLead ? vipLead.status : 'Active'}
                  >
                    <option value="Active">აქტიური</option>
                    <option value="Closed">დახურული</option>
                    <option value="Problem">პრობლემური</option>
                  </Input>
                </FormGroup>
                <FormGroup>
                  <Label for="comment">კომენტარი</Label>
                  <Input type="textarea" id="comment" name="comment" defaultValue={vipLead ? vipLead.comment : ''} />
                </FormGroup>
                <Col style={{ textAlign: 'right' }}>
                  <Button type="submit" color="primary">
                    {isEdit ? 'გნახლება' : 'დამატება'}
                  </Button>
                </Col>
              </Form>
            </ModalBody>
          </Modal>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default VipLeadsPage;
