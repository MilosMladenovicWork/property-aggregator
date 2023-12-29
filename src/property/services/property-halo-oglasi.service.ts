import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { InjectPage } from 'nest-puppeteer';
import { Page } from 'puppeteer';
import { sleep } from 'src/utils/sleep';
import { Property } from '../schema/property.schema';
import { PropertyHaloOglasiDataExtractingService } from './property-halo-oglasi-data-extracting.service';
import { PropertyHaloOglasiTraversalService } from './property-halo-oglasi-traversal.service';

@Injectable()
export class PropertyHaloOglasiService {
  constructor(
    @InjectModel(Property.name) private propertyModel: Model<Property>,
    //@ts-expect-error ts version problem
    @InjectPage() private readonly page: Page,
    private propertyHaloOglasiTraversalService: PropertyHaloOglasiTraversalService,
    private propertyHaloOglasiDataExtractingService: PropertyHaloOglasiDataExtractingService,
  ) {}

  async getPropertiesFromHaloOglasi() {
    try {
      await this.propertyHaloOglasiTraversalService.goToSpecificPropertiesResultPage(
        {
          pageNumber: 1,
          page: this.page,
        },
      );

      const totalNumberOfPages =
        await this.propertyHaloOglasiDataExtractingService.getHaloOglasiNumberOfPagesFromPropertyResultsPage(
          {
            page: this.page,
          },
        );

      const properties =
        await this.propertyHaloOglasiDataExtractingService.getHaloOglasiPropertiesFromPropertyResultsPage(
          {
            page: this.page,
          },
        );

      const propertiesWithFullData =
        await this.getHaloOglasiFullPropertiesDataForProperties({
          properties,
        });

      for (const property of propertiesWithFullData) {
        await this.propertyModel.updateOne({ url: property.url }, property, {
          upsert: true,
        });
      }

      let pageNumber = 2;

      while (pageNumber < totalNumberOfPages) {
        await sleep(2000);

        await this.propertyHaloOglasiTraversalService.goToSpecificPropertiesResultPage(
          { page: this.page, pageNumber },
        );

        const propertiesOnCurrentPage =
          await this.propertyHaloOglasiDataExtractingService.getHaloOglasiPropertiesFromPropertyResultsPage(
            {
              page: this.page,
            },
          );

        const propertiesWithFullData =
          await this.getHaloOglasiFullPropertiesDataForProperties({
            properties: propertiesOnCurrentPage,
          });

        for (const property of propertiesWithFullData) {
          await this.propertyModel.updateOne({ url: property.url }, property, {
            upsert: true,
          });
        }

        properties.concat(propertiesOnCurrentPage);

        pageNumber++;
      }

      return properties;
    } catch (error) {
      console.error('Error while scraping job listings:', error);
    }

    return [];
  }

  async getHaloOglasiFullPropertiesDataForProperties({
    properties,
  }: {
    properties: Property[];
  }): Promise<Property[]> {
    const propertiesWithAllData: Property[] = [];

    for (const property of properties) {
      await this.propertyHaloOglasiTraversalService.goToPropertyPage({
        property,
        page: this.page,
      });

      propertiesWithAllData.push(
        await this.propertyHaloOglasiDataExtractingService.getHaloOglasiPropertyDataFromPropertyPage(
          {
            property,
            page: this.page,
          },
        ),
      );
    }

    return propertiesWithAllData;
  }
}
