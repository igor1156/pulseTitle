import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash/fp';

import SortableTableHeaderCell from './SortableTableHeaderCell';

export default class SortableTableHeaderRow extends PureComponent {
    static propTypes = {
      headers: PropTypes.arrayOf(PropTypes.shape({
        name: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        icon: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
        transformer: PropTypes.func,
      })).isRequired,
      onHeaderCellClick: PropTypes.func.isRequired,
    };

    state = {
      sortingOrder: null,
      sortByColumnWitName: null,
    };

    getNextSorting = (sortingOrder) => {
      switch (sortingOrder) {
        case 'asc':
          return 'desc';
        case 'desc':
        default:
          return 'asc';
      }
    };

    handleCellClick = (e, name) => {
      const { onHeaderCellClick } = this.props;
      const sortingOrder = this.getNextSorting(this.state.sortingOrder);
      this.setState({ sortByColumnWitName: name, sortingOrder });
      if (_.isFunction(onHeaderCellClick)) onHeaderCellClick(e, { name, sortingOrder })
    };

    render() {
      const { sortingOrder, sortByColumnWitName } = this.state;
      const getSortingOrder = name => (name === sortByColumnWitName
        ? sortingOrder
        : null);

      return (<tr>
        {this.props.headers.map(({ name, title, icon }) => <SortableTableHeaderCell
          key={_.uniqueId('__SortableTableHeaderCell__')}
          onClick={this.handleCellClick}
          sortingOrder={getSortingOrder(name)}
          {...{ name, title, icon }}
        />)}
      </tr>)
    }
}
