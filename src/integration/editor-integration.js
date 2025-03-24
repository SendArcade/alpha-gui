/* eslint-disable valid-jsdoc */
import React from 'react';
import ReactDOM from 'react-dom';
import {injectIntl} from 'react-intl';
import {setAppElement} from 'react-modal';
import {compose} from 'redux';
import AppStateHOC from '../lib/app-state-hoc.jsx';
import ErrorBoundaryHOC from '../lib/error-boundary-hoc.jsx';
import GUI from '../containers/gui.jsx';
import {setProjectId} from '../reducers/project-state.js';
import {setPlayer} from '../reducers/mode.js';
import styles from './editor.css';
 
const WrappedGUI = compose(
    AppStateHOC,
    ErrorBoundaryHOC('Editor Integration'),
    injectIntl
)(GUI);
 
class EditorIntegration extends EventTarget {
    constructor () {
        super();
 
        /**
          * Root HTML element. React context lives inside here.
          * @type {HTMLElement}
          */
        this.root = document.createElement('div');
        this.root.className = styles.gui;
        setAppElement(this.root);

        this._userProjectSaver = () => Promise.reject(
            new Error('Need to use setProjectSaver(...) to implement saving')
        );
        this._userThumbnailSaver = () => Promise.reject(
            new Error('Need to use setThumbnailSaver(...) to implement saving')
        );
        this._userAssetSaver = () => Promise.reject(
            new Error('Need to use setAssetSaver(...) to implement saving')
        );

        // Supplied to the GUI on render.
        this._props = {
            // Default to project not being owned by user
            canSave: false,
            canEditTitle: false,
 
            // Enable "See project page" button in editor.
            enableCommunity: true,
 
            // This only controls the initial state. Future changes are handled in redux.
            isPlayerOnly: true,

            assetHost: 'https://assets.scratch.mit.edu',
            projectHost: 'https://projects.scratch.mit.edu',

            onUpdateProjectData: async (projectID, projectJSON) => {
                await this._userProjectSaver(projectID, projectJSON);
                return {
                    id: projectID
                };
            },

            onUpdateProjectThumbnail: async (projectID, thumbnailBlob) => {
                await this._userThumbnailSaver(projectID, thumbnailBlob);
            },

            onUpdateAssetData: async (assetType, dataFormat, data, assetId) => {
                await this._userAssetSaver(`${assetId}.${dataFormat}`, data);
                return {
                    status: 'ok'
                };
            }
        };
 
        // Do initial render so below logic works.
        this._render();
 
        /**
          * Internal redux store.
          */
        this.redux = window.ReduxStore; // ugly hack, but works
 
        /**
          * scratch-vm instance.
          */
        this.vm = this.redux.getState().scratchGui.vm;
 
        let previousState = this.redux.getState();
        this.redux.subscribe(() => {
            const newState = this.redux.getState();
 
            if (newState.scratchGui.mode.isPlayerOnly && !previousState.scratchGui.mode.isPlayerOnly) {
                this.dispatchEvent(new Event('exit-editor'));
            } else if (!newState.scratchGui.mode.isPlayerOnly && previousState.scratchGui.mode.isPlayerOnly) {
                // By the time this fires, block editor may already be set up, so have to fire a resize event after
                // so that it displays as the right size.
                this.dispatchEvent(new Event('enter-editor'));
                window.dispatchEvent(new Event('resize'));
            }
 
            previousState = newState;
        });
    }
 
    _render () {
        ReactDOM.render(React.createElement(WrappedGUI, this._props), this.root);
    }
 
    /**
      * Start loading a project using its ID.
      * @param {string} id Project ID to load
      */
    loadProjectById (id) {
        this.redux.dispatch(setProjectId(id));
    }
 
    /**
      * Toggle editor mode. You are expected to move the root element to a proper context on your own.
      * @param {boolean} isEditing Whether to enable editing mode
      */
    setInEditor (isEditing) {
        this.redux.dispatch(setPlayer(!isEditing));
    }
 
    /**
      * Toggle whether the user is allowed to try saving over the project. This usually corresponds to
      * the user "owning" the project instead of just being a viewer.
      * @param {boolean} canSave Whether the user can save and edit the project title
      */
    setCanSave (canSave) {
        this._props.canSave = canSave;
        this._props.canEditTitle = canSave;
        this._render();
    }

    /**
      * Change URL to download projects from.
      * @param {string} projectHost Gets appended with eg. "/104" (project IDs need not be numbers if you don't want)
      */
    setProjectHost (projectHost) {
        this._props.projectHost = projectHost;
        this._render();
    }

    /**
     * Change URL to download assets from.
     * @param {string} assetHost Gets appended with eg. "/abcdef...01234.svg"
     */
    setAssetHost (assetHost) {
        this._props.assetHost = assetHost;
        this._render();
    }
    
    /**
      * Set callback used for saving project JSON.
      * @param {(projectID: string, projectJSON: string) => Promise<void>} callback
      */
    setProjectSaver (callback) {
        this._userProjectSaver = callback;
    }

    /**
     * Set callback used for saving project thumbnails.
     * @param {(projectID: string, thumbnailBlob: Blob) => Promise<void>} callback
     */
    setThumbnailSaver (callback) {
        this._userThumbnailSaver = callback;
    }

    /**
     * Set callback used for saving asset data.
     * @param {(md5ext: string, data: Uint8Array) => Promise<void>} callback
     */
    setAssetSaver (callback) {
        this._userAssetSaver = callback;
    }
}
 
export default EditorIntegration;
