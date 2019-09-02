/**
 * Document view component.
 * @module components/theme/View/DocumentView
 */

import 'react-mosaic-component/react-mosaic-component.css';

import Helmet from 'react-helmet';
import PropTypes from 'prop-types';
import React, { Component } from 'react';

import { Container, Image } from 'semantic-ui-react';
// import { map } from 'lodash';
import { settings, tiles } from '~/config';

import {
  // Corner,
  // createBalancedTreeFromLeaves,
  // getLeaves,
  // getNodeAtPath,
  // getOtherDirection,
  // getPathToCorner,
  Mosaic,
  // MosaicDirection,
  // MosaicNode,
  // MosaicParent,
  MosaicWindow,
  MosaicZeroState,
  // updateTree,
} from 'react-mosaic-component';

import {
  getTilesFieldname,
  getTilesLayoutFieldname,
  hasTilesData,
} from '@plone/volto/helpers';

/**
 * Component to display the document view.
 * @function DocumentView
 * @param {Object} content Content object.
 * @returns {string} Markup of the component.
 */

class MosaicView extends Component {
  constructor(props) {
    super(props);

    let content = props.content;
    console.log('content', content);
    const tilesLayoutFieldname = getTilesLayoutFieldname(content);

    let first = content[tilesLayoutFieldname].items[0];

    if (!__SERVER__) {
      this.state = {
        currentNode: first,
      };
    }

    console.log('This.state', this.state);
  }

  createNode = () => {
    console.log('Called createNode');
  };

  onChange = currentNode => {
    this.setState({ currentNode });
  };

  onRelease = currentNode => {
    console.log('Mosaic.onRelease():', currentNode);
  };

  renderTile(content, tileid, tilesFieldname) {
    let Tile = null;
    let tiletype = content[tilesFieldname][tileid]['@type'];
    console.log('tiletype', tiletype);
    Tile = tiles.defaultTilesViewMap[tiletype];
    console.log('My tile', Tile);
    return Tile !== null ? (
      <div><span>Aici vine tile</span>
      <Tile
        key={tileid}
        properties={content}
        data={content[tilesFieldname][tileid]}
      />
    </div>
    ) : (
      <div> {JSON.stringify(content[tilesFieldname][tileid]['@type'])} </div>
    );
  }

  render() {
    const content = this.props.content;
    const tilesFieldname = getTilesFieldname(content);
    console.log('This.state', this.state);

    return true ? (
      <div id="page-document" className="ui wrapper">
        <Helmet title={content.title} />
        <div>bla</div>

        <Mosaic
          renderTile={(tileid, path) => (
            <MosaicWindow
              title={`Window ${tileid}`}
              createNode={this.createNode}
              path={path}
            >
              {
                this.renderTile(content, tileid, tilesFieldname)
              }
            </MosaicWindow>
          )}
          value={this.state.currentNode}
          onChange={this.onChange}
          onRelease={this.onRelease}
        />
      </div>
    ) : (
      <Container id="page-document">
        <Helmet title={content.title} />
        <h1 className="documentFirstHeading">{content.title}</h1>
        {content.description && (
          <p className="documentDescription">{content.description}</p>
        )}
        {content.image && (
          <Image
            className="document-image"
            src={content.image.scales.thumb.download}
            floated="right"
          />
        )}
        {content.remoteUrl && (
          <span>
            The link address is:
            <a href={content.remoteUrl}>{content.remoteUrl}</a>
          </span>
        )}
        {content.text && (
          <div
            dangerouslySetInnerHTML={{
              __html: content.text.data.replace(
                /a href="([^"]*\.[^"]*)"/g,
                `a href="${settings.apiPath}$1/download/file"`,
              ),
            }}
          />
        )}
      </Container>
    );
  }
}

/**
 * Property types.
 * @property {Object} propTypes Property types.
 * @static
 */

MosaicView.propTypes = {
  /**
   * Content of the object
   */
  content: PropTypes.shape({
    /**
     * Title of the object
     */
    title: PropTypes.string,
    /**
     * Description of the object
     */
    description: PropTypes.string,
    /**
     * Text of the object
     */
    text: PropTypes.shape({
      /**
       * Data of the text of the object
       */
      data: PropTypes.string,
    }),
  }).isRequired,
};

export default MosaicView;
