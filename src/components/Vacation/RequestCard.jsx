import React from 'react';
import './RequestCard.css';
import { useTranslation } from 'react-i18next';

const RequestCard = ({ type, duration, startDay, endDay, status, location }) => {
  const { t } = useTranslation();
  return (
    <div className="request-card">
      <div className="request-info">
        <span className="request-type">
          <span className="dot"></span> {type}
        </span>
        {location && (
          <>
            <div className="vacation-request-wrapper">
              <span className="vacation-label">Location</span>
              <span className="request-end-day">{location}</span>
            </div>
          </>
        )}
        {duration && (
          <div className="vacation-request-wrapper">
            <span className="vacation-label">Duration</span>
            <span className="request-duration">{duration}</span>
          </div>
        )}
        {startDay && (
          <div className="vacation-request-wrapper">
            <span className="vacation-label">{t("start_date")}</span>
            <span className="request-start-day">{startDay}</span>
          </div>
        )}
        <div className="vacation-request-wrapper">
          <span className="vacation-label">{t("end_date")}</span>
          <span className="request-end-day">{endDay}</span>
        </div>
      </div>
      <div className={`request-status ${status.toLowerCase()}`}>
        {status}
      </div>
    </div>
  );
};

export default RequestCard;
