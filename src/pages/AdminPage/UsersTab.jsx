import React from 'react';
import { Button, Input, Badge } from 'reactstrap';
import { FaSearch, FaPlus, FaTrash, FaFileDownload, FaEdit } from 'react-icons/fa';
import ModernTable from 'components/ModernTable';

const UsersTab = ({
    searchTerm,
    setSearchTerm,
    openUserModal,
    filteredUsers,
    handleDeleteUser,
    exportUsersToExcel,
    isAdmin,
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
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="მოძებნეთ მომხმარებელი..."
                            style={searchInputStyle}
                        />
                        <FaSearch style={searchIconStyle} />
                    </div>
                </div>
                <div className="d-flex gap-2">
                    {isAdmin && (
                        <div className="d-flex gap-2">
                            <Button
                                color="success"
                                onClick={exportUsersToExcel}
                                className="d-flex align-items-center"
                            >
                                <FaFileDownload className="me-1" /> ექსპორტი
                            </Button>
                            <Button
                                color="primary"
                                onClick={() => openUserModal(null)}
                                className="d-flex align-items-center"
                            >
                                <FaPlus className="me-1" /> მომხმარებლის დამატება
                            </Button>
                        </div>
                    )}
                </div>
            </div>

            <ModernTable
                data={filteredUsers}
                columns={[
                    {
                        header: '#',
                        field: 'index',
                        render: (_, index) => index + 1,
                        style: { width: '5%' },
                        cellClassName: 'text-center'
                    },
                    {
                        header: 'გვარი',
                        field: 'sur_name',
                        style: { width: '25%' },
                        render: (item) => (
                            <div className="d-flex align-items-center">
                                <div className="avatar-xs me-2">
                                    <span className="avatar-title rounded-circle bg-primary text-white">
                                        {item.sur_name?.charAt(0)}
                                    </span>
                                </div>
                                {item.sur_name}
                            </div>
                        )
                    },
                    {
                        header: 'სახელი',
                        field: 'name',
                        style: { width: '25%' }
                    },
                    {
                        header: 'ელ-ფოსტა',
                        field: 'email',
                        style: { width: '25%' }
                    },
                    {
                        header: 'დეპარტამენტი',
                        field: 'department',
                        style: { width: '20%' },
                        render: (item) => (
                            item.department?.name || (
                                <Badge color="warning" pill>
                                    არ არის მითითებული
                                </Badge>
                            )
                        )
                    },
                    {
                        header: 'როლი',
                        field: 'role',
                        style: { width: '10%' },
                        render: (item) => (
                            <Badge color="info" pill>
                                {item.role}
                            </Badge>
                        )
                    },
                    {
                        header: 'მოქმედება',
                        style: { width: '15%' },
                        cellClassName: 'text-center',
                        render: (item) => (
                            <div className="d-flex justify-content-center">
                                <Button
                                    color="primary"
                                    size="sm"
                                    className="me-2"
                                    onClick={() => openUserModal(item)}
                                >
                                    <FaEdit />
                                </Button>
                                <Button
                                    color="danger"
                                    size="sm"
                                    onClick={() => handleDeleteUser(item)}
                                >
                                    <FaTrash />
                                </Button>
                            </div>
                        )
                    }
                ]}
                currentPage={1}
                itemsPerPage={10}
                totalItems={filteredUsers.length}
                onPageChange={() => { }}
            />
        </>
    );
};

export default UsersTab; 