import React, { useEffect, useState, useMemo } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Form, FormGroup, Label, Input } from 'reactstrap';
import Breadcrumbs from '../../components/Common/Breadcrumb';
import TableContainer from '../../components/Common/TableContainer';
import { getDailyList, createDaily } from '../../services/daily';
import { getDepartments } from '../../services/auth';

const Dailies = () => {
    const [data, setData] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [modal, setModal] = useState(false);
    const [newDaily, setNewDaily] = useState({
        date: new Date().toISOString().split('T')[0],
        name: '',
        department: '',
        description: ''
    });

    // Assuming you have a way to check if the user is an admin
    const isAdmin = true;  // Replace with actual admin check logic

    const toggleModal = () => setModal(!modal);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewDaily({ ...newDaily, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await createDaily(newDaily);
            setModal(false);  // Close modal after successful submission
            setNewDaily({
                date: new Date().toISOString().split('T')[0],
                name: '',
                department: '',
                description: ''
            });  // Clear form data
            fetchData();  // Refresh the data in the table
        } catch (error) {
            console.error('Error creating daily:', error);
        }
    };

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await getDailyList(currentPage, itemsPerPage);
            const sortedData = response.data.data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
            setData(sortedData);
            setTotalItems(response.data.total);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [currentPage, itemsPerPage]);

    useEffect(() => {
        const fetchDepartments = async () => {
            try {
                const response = await getDepartments();
                setDepartments(response.data.departments);
            } catch (error) {
                setError(error.message);
            }
        };

        fetchDepartments();
    }, []);

    const columns = useMemo(
        () => [
            {
                header: 'საკითხის ნომერი',
                accessorKey: 'id',
                enableSorting: true,
            },
            {
                header: 'თარიღი',
                accessorKey: 'date',
                enableSorting: true,
            },
            {
                header: 'საკითხი',
                accessorKey: 'name',
                enableSorting: true,
            },
            {
                header: 'დეპარტამენტი',
                accessorKey: 'user.department.name',
                enableSorting: true,
            },
            {
                header: 'სახელი/გვარი',
                accessorKey: 'user.name',
                enableSorting: true,
            },
        ],
        []
    );

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        if (currentPage < Math.ceil(totalItems / itemsPerPage)) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handleItemsPerPageChange = (e) => {
        setItemsPerPage(parseInt(e.target.value));
        setCurrentPage(1);
    };

    const handleExport = () => {
        const csvRows = [];
        const headers = columns.map(col => col.header);
        csvRows.push(headers.join(','));

        data.forEach(row => {
            const values = columns.map(col => {
                const accessor = col.accessorKey.split('.');
                let value = row;
                accessor.forEach(key => {
                    value = value ? value[key] : '';
                });
                return `"${value || ''}"`;
            });
            csvRows.push(values.join(','));
        });

        const csvContent = `data:text/csv;charset=utf-8,${csvRows.join('\n')}`;
        const link = document.createElement('a');
        link.href = encodeURI(csvContent);
        link.setAttribute('download', 'daily_report.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className="page-content">
            <div className="container-fluid">
                <Breadcrumbs title="Tables" breadcrumbItem="Daily Report" />
                <div className="table-container">
                    <h2 className="page-name">
                        <div className="d-flex justify-content-end">
                            {isAdmin && (
                                <Button color="secondary" className="ms-2" onClick={handleExport}>Export CSV</Button>
                            )}
                            <Button color="primary" className="ms-2" onClick={toggleModal}>Add Daily Report</Button>
                        </div>
                    </h2>
                    
                    <TableContainer
                        columns={columns}
                        data={data}
                        isGlobalFilter={true}
                        isPagination={true}
                        SearchPlaceholder="Search records..."
                        pagination="pagination"
                        paginationWrapper='dataTables_paginate paging_simple_numbers'
                        tableClass="table-bordered table-nowrap dt-responsive nowrap w-100 dataTable no-footer dtr-inline"
                        currentPage={currentPage}
                        itemsPerPage={itemsPerPage}
                        totalItems={totalItems}
                        onPreviousPage={handlePreviousPage}
                        onNextPage={handleNextPage}
                        onItemsPerPageChange={handleItemsPerPageChange}
                        setCurrentPage={setCurrentPage}
                    />
                </div>

                <Modal isOpen={modal} toggle={toggleModal}>
                    <ModalHeader toggle={toggleModal}>Add New Daily</ModalHeader>
                    <Form onSubmit={handleSubmit}>
                        <ModalBody>
                            <FormGroup>
                                <Label for="date">Date</Label>
                                <Input
                                    type="date"
                                    name="date"
                                    id="date"
                                    value={newDaily.date}
                                    onChange={handleInputChange}
                                    required
                                    readOnly
                                />
                            </FormGroup>
                            <FormGroup>
                                <Label for="name">Task Name</Label>
                                <Input
                                    type="text"
                                    name="name"
                                    id="name"
                                    value={newDaily.name}
                                    onChange={handleInputChange}
                                    required
                                />
                            </FormGroup>
                            <FormGroup>
                                <Label for="department">Department</Label>
                                <Input
                                    type="select"
                                    name="department"
                                    id="department"
                                    value={newDaily.department}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="">Select Department</option>
                                    {departments.map(dept => (
                                        <option key={dept.id} value={dept.id}>
                                            {dept.name}
                                        </option>
                                    ))}
                                </Input>
                            </FormGroup>
                            <FormGroup>
                                <Label for="description">Description</Label>
                                <Input
                                    type="textarea"
                                    name="description"
                                    id="description"
                                    value={newDaily.description}
                                    onChange={handleInputChange}
                                />
                            </FormGroup>
                        </ModalBody>
                        <ModalFooter>
                            <Button color="primary" type="submit">Add Daily</Button>
                            <Button color="secondary" onClick={toggleModal}>Cancel</Button>
                        </ModalFooter>
                    </Form>
                </Modal>
            </div>
        </div>
    );
};

export default Dailies;