import React, { useState } from "react";
import { Link } from "react-router-dom";
import { CrmTable } from "../../components/CrmTable";
import {
  useVacancyRequests,
  useApproveVacancyRequest,
  useRejectVacancyRequest,
} from "../../queries/vacancyRequests";
import { useToast } from "../../store/zustand/toastStore";
import CrmDialog, { DialogButton } from "../../components/CrmDialogs/Dialog";

const VacancyRequests = () => {
  const [statusFilter, setStatusFilter] = useState("");
  const [rejectModal, setRejectModal] = useState({ isOpen: false, id: null });
  const [rejectionReason, setRejectionReason] = useState("");
  const toast = useToast();

  const { data: vacancyRequests, isLoading } = useVacancyRequests({
    status: statusFilter || undefined,
  });

  const approveMutation = useApproveVacancyRequest();
  const rejectMutation = useRejectVacancyRequest();

  const handleApprove = async (id) => {
    if (window.confirm("ნამდვილად გსურთ ვაკანსიის მოთხოვნის დამტკიცება?")) {
      try {
        await approveMutation.mutateAsync(id);
        toast.success("ვაკანსიის მოთხოვნა წარმატებით დამტკიცდა");
      } catch (error) {
        toast.error("დაფიქსირდა შეცდომა, გთხოვთ სცადოთ თავიდან");
        console.error("Error approving vacancy request:", error);
      }
    }
  };

  const handleReject = async () => {
    try {
      await rejectMutation.mutateAsync({
        id: rejectModal.id,
        rejectionReason,
      });
      setRejectModal({ isOpen: false, id: null });
      setRejectionReason("");
      toast.success("ვაკანსიის მოთხოვნა წარმატებით უარყოფილია");
    } catch (error) {
      toast.error("დაფიქსირდა შეცდომა, გთხოვთ სცადოთ თავიდან");
      console.error("Error rejecting vacancy request:", error);
    }
  };

  const getStatusBadge = (status) => {
    const statusColors = {
      pending: "warning",
      approved: "success",
      rejected: "danger",
    };
    return <div className={`badge bg-${statusColors[status]}`}>{status}</div>;
  };


  const columns = React.useMemo(
    () => [
      {
        accessorKey: "position_title",
        header: "პოზიციის დასახელება",
        meta: {
          filterVariant: "text",
        },
      },
      {
        accessorKey: "requester_name",
        header: "მომთხოვნის სახელი",
        meta: {
          filterVariant: "text",
        },
      },
      {
        accessorKey: "department",
        header: "დეპარტამენტი",
        meta: {
          filterVariant: "text",
        },
      },
      {
        accessorKey: "location",
        header: "მდებარეობა",
        meta: {
          filterVariant: "text",
        },
      },
      {
        accessorKey: "number_of_vacancies",
        header: "ვაკანსიების რაოდენობა",
      },
      {
        accessorKey: "status",
        header: "სტატუსი",
        cell: info => getStatusBadge(info.getValue()),
        meta: {
          filterVariant: "select",
          filterOptions: [
            { value: "pending", label: "მოლოდინში" },
            { value: "approved", label: "დამტკიცებული" },
            { value: "rejected", label: "უარყოფილი" },
          ],
        },
      },
      {
        accessorKey: "submission_date",
        header: "შექმნის თარიღი",
        cell: info => new Date(info.getValue()).toLocaleDateString(),
      },
      {
        id: "actions",
        header: "მოქმედებები",
        cell: ({ row }) => (
          <div className="flex gap-2">
            <Link
              to={`/vacancy-requests/${row.original.id}`}
              className="px-3 py-1 text-sm font-medium text-blue-600 hover:text-blue-700 dark:!text-blue-400 dark:!hover:text-blue-300"
            >
              ნახვა
            </Link>
            {row.original.status === "pending" && (
              <>
                <button
                  onClick={() => handleApprove(row.original.id)}
                  className="px-3 py-1 text-sm font-medium text-green-600 hover:text-green-700 dark:!text-green-400 dark:!hover:text-green-300"
                >
                  დამტკიცება
                </button>
                <button
                  onClick={() =>
                    setRejectModal({ isOpen: true, id: row.original.id })
                  }
                  className="px-3 py-1 text-sm font-medium text-red-600 hover:text-red-700 dark:!text-red-400 dark:!hover:text-red-300"
                >
                  უარყოფა
                </button>
              </>
            )}
          </div>
        ),
      },
    ],
    []
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900 dark:!text-white">
          ვაკანსიის მოთხოვნები
        </h1>
        <div className="flex gap-4">
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="block w-48 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm dark:!bg-gray-700 dark:!border-gray-600 dark:!text-white"
          >
            <option value="">ყველა სტატუსი</option>
            <option value="pending">მოლოდინში</option>
            <option value="approved">დამტკიცებული</option>
            <option value="rejected">უარყოფილი</option>
          </select>
          <Link
            to="/vacancy-requests/create"
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:!bg-blue-500 dark:!hover:bg-blue-600"
          >
            ახალი მოთხოვნა
          </Link>
        </div>
      </div>

      <CrmTable
        columns={columns}
        data={vacancyRequests?.data || []}
        isLoading={isLoading}
      />

      <CrmDialog
        isOpen={rejectModal.isOpen}
        onOpenChange={() => setRejectModal({ isOpen: false, id: null })}
        title="ვაკანსიის მოთხოვნის უარყოფა"
        description="გთხოვთ მიუთითოთ უარყოფის მიზეზი"
      >
        <div className="mt-4">
          <textarea
            value={rejectionReason}
            onChange={e => setRejectionReason(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:!bg-gray-700 dark:!border-gray-600 dark:!text-white"
            rows={4}
            placeholder="უარყოფის მიზეზი..."
          />
        </div>
        <div className="mt-5 sm:mt-6 flex justify-end gap-3">
          <DialogButton
            actionType="cancel"
            onClick={() => setRejectModal({ isOpen: false, id: null })}
            label="გაუქმება"
          />
          <DialogButton
            actionType="confirm"
            onClick={handleReject}
            disabled={!rejectionReason.trim()}
            label="უარყოფა"
          />
        </div>
      </CrmDialog>
    </div>
  );
};

export default VacancyRequests; 