import React, { PropTypes } from 'react';

function PanelHeader(props) {
  const { children } = props;

  return (
    <div className="qr-panel-header">
      {children}
    </div>
  );
}

export default PanelHeader;
