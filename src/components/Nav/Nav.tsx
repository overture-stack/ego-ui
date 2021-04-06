import { css } from 'glamor';
import { capitalize, pickBy, throttle } from 'lodash';
import React from 'react';
import { NavLink } from 'react-router-dom';

import RESOURCE_MAP from 'common/RESOURCE_MAP';
import Ripple from 'components/Ripple';
import UnstyledButton from 'components/UnstyledButton';
import { injectState } from 'freactal';
import { compose } from 'recompose';
import { Icon } from 'semantic-ui-react';
import CurrentUserNavItem from './CurrentUserNavItem';
import styles from './Nav.styles';
import brandImage from 'assets/brand-image.svg';
import brandImageSmall from 'assets/brand-image-small.svg';

const resetList = {
  listStyleType: 'none',
  margin: 0,
  padding: 0,
};

const enhance = compose(injectState);
const MIN_SCREEN_WIDTH = 1400;
class Nav extends React.Component<any, any> {
  state = { collapsed: false, windowSizeSmall: false };
  onResize = throttle(() => {
    const windowSizeSmall = window.innerWidth < MIN_SCREEN_WIDTH;
    if (windowSizeSmall !== this.state.windowSizeSmall) {
      this.props.effects.setUserPreferences({ collapsed: undefined });
      this.setState({ windowSizeSmall, collapsed: windowSizeSmall });
    }
  }, 100);
  componentWillMount() {
    const windowSizeSmall = window.innerWidth < MIN_SCREEN_WIDTH;
    const userSelected = this.props.state.preferences.collapsed;
    this.setState({
      windowSizeSmall,
      collapsed: userSelected === undefined ? windowSizeSmall : userSelected,
    });
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
            <img className="small" src={brandImageSmall} alt="" />
            <img className="regular" src={brandImage} alt="" />
          </div>
        </div>
        <ul className={`LinkList ${css(resetList, styles.linkList)}`}>
          {Object.keys(pickBy(RESOURCE_MAP, (r) => r.isParent)).map((key) => {
            const resource = RESOURCE_MAP[key];

            return (
              <li key={key}>
                <Ripple
                  as={NavLink}
                  style={styles.link}
                  to={`/${resource.name.plural}`}
                  activeClassName={'active'}
                >
                  <div className="content">
                    <resource.Icon style={{ opacity: 0.9 }} />
                    {collapsed ? (
                      <div style={{ height: 35 }} />
                    ) : (
                      <span className="text">{capitalize(`${resource.name.plural}`)}</span>
                    )}
                  </div>
                </Ripple>
              </li>
            );
          })}
        </ul>

        <CurrentUserNavItem style={styles.currentUser} />

        <Ripple
          passStyle
          as={UnstyledButton}
          style={styles.collapse}
          onClick={() => {
            this.props.effects.setUserPreferences({ collapsed: !collapsed });
            this.setState({ collapsed: !collapsed });
          }}
        >
          {collapsed ? <Icon name="chevron right" /> : <Icon name="chevron left" />}
        </Ripple>
      </div>
    );
  }
}

export default enhance(Nav);
