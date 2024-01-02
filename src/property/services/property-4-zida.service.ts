import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { InjectPage } from 'nest-puppeteer';
import { Page } from 'puppeteer';
import { sleep } from 'src/utils/sleep';
import { Property } from '../schema/property.schema';
import { PROPERTY_PROVIDERS } from '../types/property-providers.enum';
import { Property4ZidaDataExtractingService } from './property-4-zida-data-extracting.service';
import { Property4ZidaTraversalService } from './property-4-zida-traversal.service';

@Injectable()
export class Property4ZidaService {
  constructor(
    @InjectModel(Property.name) private propertyModel: Model<Property>,
    //@ts-expect-error ts version problem
    @InjectPage(PROPERTY_PROVIDERS.CETIRI_ZIDA) private readonly page: Page,
    private property4ZidaTraversalService: Property4ZidaTraversalService,
    private property4ZidaDataExtractingService: Property4ZidaDataExtractingService,
  ) {}

  async getPropertiesFrom4Zida() {
    try {
      await this.property4ZidaTraversalService.goToSpecificPropertiesResultPage(
        {
          pageNumber: 1,
          page: this.page,
        },
      );

      const totalNumberOfPages =
        await this.property4ZidaDataExtractingService.get4ZidaNumberOfPagesFromPropertyResultsPage();

      const properties =
        await this.property4ZidaDataExtractingService.get4ZidaPropertiesFromPropertyResultsPage(
          {
            page: this.page,
          },
        );

      const propertiesWithFullData =
        await this.get4ZidaFullPropertiesDataForProperties({
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

        await this.property4ZidaTraversalService.goToSpecificPropertiesResultPage(
          { page: this.page, pageNumber },
        );

        const propertiesOnCurrentPage =
          await this.property4ZidaDataExtractingService.get4ZidaPropertiesFromPropertyResultsPage(
            {
              page: this.page,
            },
          );

        const propertiesWithFullData =
          await this.get4ZidaFullPropertiesDataForProperties({
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

  async get4ZidaFullPropertiesDataForProperties({
    properties,
  }: {
    properties: Property[];
  }): Promise<Property[]> {
    const propertiesWithAllData: Property[] = [];

    for (const property of properties) {
      await this.property4ZidaTraversalService.goToPropertyPage({
        property,
        page: this.page,
      });

      propertiesWithAllData.push(
        await this.property4ZidaDataExtractingService.get4ZidaPropertyDataFromPropertyPage(
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
