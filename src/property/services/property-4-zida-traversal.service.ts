import { Injectable } from '@nestjs/common';
import { Page } from 'puppeteer';
import { Property } from '../schema/property.schema';

@Injectable()
export class Property4ZidaTraversalService {
  private propertyResultsUrl: string =
    'https://www.4zida.rs/prodaja-stanova/beograd';

  async goToSpecificPropertiesResultPage({
    pageNumber,
    page,
  }: {
    pageNumber: number;
    page: Page;
  }) {
    const propertyResultsUrl = new URL(this.propertyResultsUrl);

    propertyResultsUrl.searchParams.set('strana', pageNumber.toString());

    await page.goto(propertyResultsUrl.toString());
  }

  async goToPropertyPage({
    page,
    property,
  }: {
    page: Page;
    property: Property;
  }) {
    await page.goto(property.url);
  }
}
