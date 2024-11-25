import React from 'react';
import { Button, Input } from 'reactstrap';
import { FaSearch, FaPlus, FaTrash, FaEdit } from 'react-icons/fa';
import ModernTable from 'components/ModernTable';
import { Badge } from 'reactstrap';

const DepartmentsTab = ({
    departmentSearchTerm,
    setDepartmentSearchTerm,
    openDepartmentModal,
    filteredDepartments,
    handleDeleteDepartment,
    searchInputStyle,
    searchIconStyle
}) => {
    return (
        <>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div className="search-box" style={{ minWidth: '300px' }}>
                    <div className="position-relative">
                        <Input
                            type="text"
                            value={departmentSearchTerm}
                            onChange={(e) => setDepartmentSearchTerm(e.target.value)}
                            placeholder="მოძებნეთ დეპარტამენტი..."
                            style={searchInputStyle}
                        />
                        <FaSearch style={searchIconStyle} />
                    </div>
                </div>
                <Button
                    color="primary"
                    onClick={() => openDepartmentModal(null)}
                    className="d-flex align-items-center"
                >
                    <FaPlus className="me-1" /> დეპარტამენტის დამატება
                </Button>
            </div>

            <ModernTable
                data={filteredDepartments}
                columns={[
                    {
                        header: '#',
                        field: 'index',
                        render: (_, index) => index + 1,
                        style: { width: '5%' },
                        cellClassName: 'text-center'
                    },
                    {
                        header: 'დეპარტამენტი',
                        field: 'name',
                        style: { width: '35%' }
                    },
                    {
                        header: 'ხელმძღვანელი',
                        field: 'head',
                        style: { width: '40%' },
                        render: (item) => (
                            item.head ? (
                                <div className="d-flex align-items-center">
                                    <div className="avatar-xs me-2">
                                        <span className="avatar-title rounded-circle bg-primary text-white">
                                            {item.head.name.charAt(0)}
                                        </span>
                                    </div>
                                    {item.head.name}
                                </div>
                            ) : (
                                <Badge color="warning" pill>
                                    არ არის მითითებული
                                </Badge>
                            )
                        )
                    },
                    {
                        header: 'მოქმედება',
                        style: { width: '20%' },
                        cellClassName: 'text-center',
                        render: (item) => (
                            <div className="d-flex justify-content-center">
                                <Button
                                    color="primary"
                                    size="sm"
                                    className="me-2"
                                    onClick={() => openDepartmentModal(item)}
                                >
                                    <FaEdit />
                                </Button>
                                <Button
                                    color="danger"
                                    size="sm"
                                    onClick={() => handleDeleteDepartment(item.id, item.name)}
                                >
                                    <FaTrash />
                                </Button>
                            </div>
                        )
                    }
                ]}
                currentPage={1}
                itemsPerPage={10}
                totalItems={filteredDepartments.length}
                onPageChange={() => { }}
            />
        </>
    );
};

export default DepartmentsTab; 