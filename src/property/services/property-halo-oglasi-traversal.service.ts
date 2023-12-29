import { Injectable } from '@nestjs/common';
import { Page } from 'puppeteer';
import { Property } from '../schema/property.schema';

@Injectable()
export class PropertyHaloOglasiTraversalService {
  private url: string;

  constructor() {
    this.url = 'https://www.halooglasi.com/nekretnine/prodaja-stanova/beograd';
  }

  async goToSpecificPropertiesResultPage({
    pageNumber,
    page,
  }: {
    pageNumber: number;
    page: Page;
  }) {
    const pageUrl = new URL(this.url);

    pageUrl.searchParams.set('page', pageNumber.toString());

    await page.goto(pageUrl.toString());
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
