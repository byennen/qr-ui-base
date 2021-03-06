import React, { PropTypes } from 'react';
import { ColorHelpers } from './../../helpers';

function TabItem(props) {
  const { children, active, link } = props;
  let className = 'qr-tab-item';
  if(!!active) className += ' active';
  const activeStyle = ColorHelpers.generateStyleForColor(['border', 'color'], 'main');

  if(!!link) return <a className={className} href={link}>{children}</a>;
  return <div style={activeStyle} className={className}>{children}</div>;
}

TabItem.propTypes = {
  active: PropTypes.bool,
  link: PropTypes.string
}

export default TabItem;
