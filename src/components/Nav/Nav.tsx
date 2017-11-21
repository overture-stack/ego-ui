import React from 'react';
import { css } from 'glamor';
import { NavLink } from 'react-router-dom';
import _ from 'lodash';

import CurrentUserNavItem from './CurrentUserNavItem';
import styles from './Nav.styles';
import { compose } from 'recompose';
import { injectState } from 'freactal';
import RESOURCE_MAP from 'common/RESOURCE_MAP';
import { Icon } from 'semantic-ui-react';
import UnstyledButton from 'components/UnstyledButton';

const resetList = {
  listStyleType: 'none',
  margin: 0,
  padding: 0,
};

const enhance = compose(injectState);
const MIN_SCREEN_WIDTH = 1400;
class Nav extends React.Component<any, any> {
  state = { collapsed: false, windowSizeSmall: false };
  onResize = _.throttle(() => {
    const windowSizeSmall = window.innerWidth < MIN_SCREEN_WIDTH;
    if (windowSizeSmall !== this.state.windowSizeSmall) {
      this.setState({ windowSizeSmall, collapsed: windowSizeSmall });
    }
  }, 100);
  componentWillMount() {
    const windowSizeSmall = window.innerWidth < MIN_SCREEN_WIDTH;
    this.setState({ windowSizeSmall, collapsed: windowSizeSmall });
    window.addEventListener('resize', this.onResize);
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.onResize);
  }
  render() {
    const { collapsed } = this.state;

    return (
      <div className={`Nav ${collapsed ? 'collapsed' : ''} ${css(styles.container)}`}>
        <div style={{ height: 190 }}>
          <div className={`Emblem ${css(styles.emblem)}`}>
            <img className="small" src={require('assets/brand-image-small.svg')} alt="" />
            <img className="regular" src={require('assets/brand-image.svg')} alt="" />
          </div>
        </div>
        <ul className={`LinkList ${css(resetList, styles.linkList)}`}>
          {Object.keys(RESOURCE_MAP).map(key => {
            const resource = RESOURCE_MAP[key];

            return (
              <li key={key}>
                <NavLink
                  className={`NavLink ${css(styles.link)}`}
                  to={`/${resource.name.plural}`}
                  activeClassName={'active'}
                >
                  <div>
                    <resource.Icon style={{ opacity: 0.9 }} />
                    <span className="text">{_.capitalize(`${resource.name.plural}`)}</span>
                  </div>
                </NavLink>
              </li>
            );
          })}
        </ul>
        <CurrentUserNavItem style={styles.currentUser} />
        <UnstyledButton
          style={styles.collapse}
          onClick={() => this.setState({ collapsed: !collapsed, userSetCollapsed: true })}
        >
          {collapsed ? <Icon name="chevron right" /> : <Icon name="chevron left" />}
        </UnstyledButton>
      </div>
    );
  }
}

export default enhance(Nav);
