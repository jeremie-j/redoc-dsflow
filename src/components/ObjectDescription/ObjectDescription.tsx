import * as React from 'react';

import { DarkRightPanel, MiddlePanel, Row, Section } from '../../common-elements';
import { MediaTypeModel, OpenAPIParser, RedocNormalizedOptions } from '../../services';
import styled from '../../styled-components';
import { OpenAPIMediaType } from '../../types';
import { MediaTypeSamples } from '../PayloadSamples/MediaTypeSamples';
import { Schema } from '../Schema';

export interface ObjectDescriptionProps {
  schemaRef: string;
  exampleRef?: string;
  showReadOnly?: boolean;
  showWriteOnly?: boolean;
  parser: OpenAPIParser;
  options: RedocNormalizedOptions;
}

export class ObjectDescription extends React.PureComponent<ObjectDescriptionProps> {
  private static getMediaType(schemaRef: string, exampleRef?: string): OpenAPIMediaType {
    if (!schemaRef) {
      return {};
    }

    const info: OpenAPIMediaType = {
      schema: { $ref: schemaRef },
    };

    if (exampleRef) {
      info.examples = { example: { $ref: exampleRef } };
    }

    return info;
  }

  private _mediaModel: MediaTypeModel;

  private get mediaModel() {
    const { parser, schemaRef, exampleRef, options } = this.props;
    if (!this._mediaModel) {
      this._mediaModel = new MediaTypeModel(
        parser,
        'json',
        false,
        ObjectDescription.getMediaType(schemaRef, exampleRef),
        options,
      );
    }

    return this._mediaModel;
  }

  render() {
    const { showReadOnly = true, showWriteOnly = false } = this.props;
    return (
      <Section>
        <Row>
          <MiddlePanel>
            <Schema
              skipWriteOnly={!showWriteOnly}
              skipReadOnly={!showReadOnly}
              schema={this.mediaModel.schema}
            />
          </MiddlePanel>
          <DarkRightPanel>
            <MediaSamplesWrap>
              <MediaTypeSamples mediaType={this.mediaModel} />
            </MediaSamplesWrap>
          </DarkRightPanel>
        </Row>
      </Section>
    );
  }
}

const MediaSamplesWrap = styled.div`
  background: ${({ theme }) => theme.codeSample.backgroundColor};
  & > div,
  & > pre {
    padding: ${props => props.theme.spacing.unit * 4}px;
    margin: 0;
  }

  & > div > pre {
    padding: 0;
  }
`;
