import axios from 'axios';
import { Buffer } from 'buffer';
import pdfMake from 'pdfmake/build/pdfmake';
import * as vfsFonts from 'pdfmake/build/vfs_fonts';
import { IUser } from '../models/users.model';
import { TDocumentDefinitions } from 'pdfmake/interfaces';
import { ITransaction } from '../models/transaction.model';
import { IRide } from '../models/rides.model';
import moment from 'moment-timezone';

pdfMake.vfs = vfsFonts.pdfMake.vfs;

// Utility function to convert image URLs to base64
async function fetchImageAsBase64(url: string): Promise<string> {
  try {
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    const imageBuffer = Buffer.from(response.data, 'binary');
    return `data:image/png;base64,${imageBuffer.toString('base64')}`;
  } catch (error) {
    console.error(`Error fetching image from ${url}:`, error);
    throw new Error(`Failed to fetch image from ${url}`);
  }
}

// Function to create PDF
export async function createWeeklyStatementPdf(
  totalAmountUntilStart: number,
  totalAmountUntilEnd: number,
  totalAmountExpenses: number,
  user: IUser,
  transactions: ITransaction[],
): Promise<Buffer> {
  try {
    const imageUrls = [
      'https://piupiu-storage.s3.us-west-2.amazonaws.com/logo/PiuPiuLogo.png', // Logo Image
      `https://piupiu-storage.s3.us-west-2.amazonaws.com${user.profile_picture}`, // User Profile Picture
    ];

    const imagePromises = imageUrls.map((url) => fetchImageAsBase64(url));
    const base64Images = await Promise.all(imagePromises);

    const [logoImage, profileImage] = base64Images;

    const transactionRows = transactions.map((transaction) => {
      const date = new Date(transaction.createdAt);
      const formattedDate = date.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      });
      const formattedTime = date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: 'numeric',
      });

      return [
        { text: `${formattedDate} ${formattedTime}`, fontSize: 10 },
        { text: transaction.purpose, fontSize: 10 },
        {
          text:
            transaction.transactionType === 'debit'
              ? `-${transaction.amount}`
              : `+${transaction.amount}`,
          fontSize: 10,
          alignment: 'right',
        },
        { text: transaction.currency, fontSize: 10, alignment: 'right' },
        { text: transaction.currentWalletbalance, fontSize: 10, alignment: 'right' },
      ];
    });

    const tableBody = [
      [
        { text: 'Processed', style: 'tableHeader' },
        { text: 'Event', style: 'tableHeader' },
        { text: 'Your earnings', style: 'tableHeader', alignment: 'right' },
        { text: 'Refunds & Expenses', style: 'tableHeader', alignment: 'right' },
        { text: 'Balance', style: 'tableHeader', alignment: 'right' },
      ],
      ...transactionRows,
    ];

    const docDefinition: TDocumentDefinitions = {
      pageSize: 'A4',
      pageMargins: [40, 60, 40, 60],

      header: {
        columns: [
          {
            image: logoImage,
            width: 145,
          },
          {
            stack: [
              { text: `Weekly Statement\n`, bold: true, fontSize: 12 },
              { text: `Weekly Statement\n`, bold: true, fontSize: 12 },
            ],
            alignment: 'right',
          },
        ],
        margin: [20, 35, 10, 10],
      },

      content: [
        {
          columns: [
            {
              stack: [
                {
                  canvas: [
                    {
                      type: 'ellipse',
                      x: 25,
                      y: 25,
                      color: '#ffffff',
                      r1: 25,
                      r2: 25,
                      lineColor: '#ffffff',
                    },
                  ],
                  width: 50,
                  height: 50,
                  absolutePosition: { x: 20, y: 10 },
                },
                {
                  image: profileImage,
                  fit: [50, 50],
                  margin: [50, 50, 50, 10],
                  alignment: 'left',
                  absolutePosition: { x: 30, y: 100 },
                },
              ],
              width: 50,
              margin: [50, 50, 10, 0],
            },
            {
              text: [
                { text: `${user.name}\n`, bold: true, fontSize: 16 },
                { text: `${user.phone_number}\n`, fontSize: 12, margin: [0, 0, 0, 5] },
                { text: `${user.email}\n`, fontSize: 12 },
              ],
              alignment: 'left',
              margin: [10, 10, 20, 20],
            },
          ],
          margin: [0, 20],
        },
        {
          columns: [
            {
              width: 6,
              canvas: [
                {
                  type: 'line',
                  x1: 0,
                  y1: 0,
                  x2: 0,
                  y2: 25,
                  lineWidth: 4,
                  lineColor: '#CCCCCC',
                },
              ],
            },
            {
              text: 'Weekly Summary',
              fontSize: 18,
              bold: true,
              margin: [10, 0, 0, 10],
            },
          ],
          margin: [0, 20],
        },
        {
          columns: [
            {
              text: 'Starting balance at Mon, Apr 29, 4:00 AM',
              bold: true,
              fontSize: 12,
            },
            {
              text: `$ ${totalAmountUntilStart ? totalAmountUntilStart.toFixed(2) : 0}`,
              fontSize: 12,
              alignment: 'right',
            },
          ],
          margin: [0, 10],
        },
        {
          columns: [
            {
              text: 'Your earnings\nFor details, see: Breakdown of Your earnings',
              fontSize: 12,
            },
            {
              text: `$ ${totalAmountUntilStart ? Number(totalAmountUntilEnd - totalAmountUntilStart).toFixed(2) : totalAmountUntilEnd}`,
              fontSize: 12,
              alignment: 'right',
            },
          ],
          margin: [0, 10],
        },
        {
          columns: [
            {
              text: 'Refunds & Expenses\nFor details, see: Breakdown of Refunds & Expenses',
              fontSize: 12,
            },
            {
              text: `$ ${totalAmountExpenses ? totalAmountExpenses.toFixed(2) : 0}`,
              fontSize: 12,
              alignment: 'right',
            },
          ],
          margin: [0, 10],
        },
        {
          canvas: [
            {
              type: 'line',
              x1: 0,
              y1: 0,
              x2: 515,
              y2: 0,
              lineWidth: 3,
              lineColor: '#CCCCCC',
            },
          ],
          margin: [0, 10],
        },
        {
          canvas: [
            {
              type: 'line',
              x1: 0,
              y1: 0,
              x2: 515,
              y2: 0,
              lineWidth: 50,
              lineColor: '#CCCCCC',
            },
          ],
          margin: [0, 30],
        },
        {
          columns: [
            {
              text: 'Ending balance at Mon, May 6, 4:00 AM',
              fontSize: 13,
              bold: true,
            },
            {
              text: `$ ${totalAmountUntilEnd ? totalAmountUntilEnd.toFixed(2) : 0}`,
              fontSize: 13,
              bold: true,
              alignment: 'right',
            },
          ],
          margin: [10, -36, 10, -36],
          fillColor: '#F5F5F5',
        },
        { text: '', pageBreak: 'after' },
        {
          columns: [
            {
              width: 6,
              canvas: [
                {
                  type: 'line',
                  x1: 0,
                  y1: 0,
                  x2: 0,
                  y2: 25,
                  lineWidth: 4,
                  lineColor: '#CCCCCC',
                },
              ],
              margin: [0, 10, 0, 10],
            },
            {
              text: 'Transactions',
              fontSize: 16,
              bold: true,
              margin: [10, 20, 0, 10],
            },
          ],
          margin: [10, 20],
        },
        {
          style: 'tableExample',
          table: {
            widths: ['auto', '*', 'auto', 'auto', 'auto'],
            headerRows: 1,
            body: tableBody,
          },
          layout: {
            hLineWidth: (i, node) => (i === 0 || i === node.table.body.length ? 0 : 0.5),
            vLineWidth: () => 0,
            paddingLeft: () => 10,
            paddingRight: () => 10,
            paddingTop: () => 10,
            paddingBottom: () => 15,
          },
        },
      ],
      styles: {
        header: {
          fontSize: 12,
          bold: true,
          margin: [0, 0, 0, 10],
        },
        tableHeader: {
          bold: true,
          fontSize: 14,
          color: 'black',
          margin: [0, 5],
        },
      },
      footer: (currentPage: number, pageCount: number) => {
        return {
          columns: [
            {
              width: 15,
              canvas: [
                {
                  type: 'line',
                  x1: 575,
                  y1: 0,
                  x2: 0,
                  y2: 0,
                  lineWidth: 4,
                  lineColor: '#CCCCCC',
                },
              ],
              margin: [10, -15, 0, 0],
            },
            {
              text: `${user.name}`,
              alignment: 'left',
              fontSize: 12,
              margin: [10, 0, 0, 0],
            },
            {
              text: `${currentPage} of ${pageCount}`,
              alignment: 'right',
              margin: [0, 0, 10, 0],
            },
          ] as any,
        };
      },
    };

    const pdfDoc = pdfMake.createPdf(docDefinition) as unknown as {
      getBuffer: (callback: (buffer: Buffer) => void) => void;
    };

    return new Promise<Buffer>((resolve, reject) => {
      pdfDoc.getBuffer((buffer) => {
        resolve(buffer);
      });
      pdfDoc.getBuffer((error) => {
        if (error) {
          reject(new Error('Error generating PDF buffer'));
        }
      });
    });
  } catch (error) {
    console.error('Error creating PDF:', error);
    throw error;
  }
}

export async function createRideEmailPdf(user: IUser, rideDetails: IRide): Promise<Buffer> {
  try {
    // List of image URLs
    console.log(rideDetails);

    const imageUrls = [
      'https://piupiu-storage.s3.us-west-2.amazonaws.com/logo/PiuPiuLogo.png',
      `https://piupiu-storage.s3.us-west-2.amazonaws.com${rideDetails.VehicleType.vehicle_image}`,
      'https://piupiu-storage.s3.us-west-2.amazonaws.com/assets/images/959d2257-d2ca-4c56-b403-959fdcbb032f.png',
    ];

    const imagePromises = imageUrls.map((url) => fetchImageAsBase64(url));
    const base64Images = await Promise.all(imagePromises);

    const date = new Date();
    const formattedDate = date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
    const formattedTime = date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: 'numeric',
    });

    const [logoImage, vehicleImage, mapScreenshot] = base64Images;

    // Safeguard against null or undefined values
    const passengerName = rideDetails.passenger?.name?.toUpperCase() ?? 'UNKNOWN';
    const driverName = `${rideDetails.driver?.name?.toUpperCase() ?? 'UNKNOWN'} ${rideDetails.driver?.name?.toUpperCase() ?? 'UNKNOWN'}`;
    const finalAmount = rideDetails.finalAmount ?? 0;
    const fare = rideDetails.fare?.toFixed(2) ?? '0.00';
    const distanceInkm = rideDetails.distanceInkm?.toFixed(2) ?? '0.00';
    const driversTip = rideDetails.driversTip ?? 0;
    const origin = rideDetails.origin ?? 'Unknown';
    const destination = rideDetails.destination ?? 'Unknown';

    let couponDetailsSection: any = {
      stack: [
        {
          text: '',
        },
      ],
    };
    if (rideDetails.Coupon.id) {
      console.log('=======================', rideDetails.Coupon);
      console.log('=======================', rideDetails.Coupon.maxDiscountAmount);

      const couponAmount = Number(rideDetails.Coupon.maxDiscountAmount) ?? '0.00';
      const couponCode = rideDetails.Coupon.code ?? 'UNKNOWN';

      couponDetailsSection = {
        stack: [
          {
            text: 'Coupon Details',
            alignment: 'left',
            bold: true,
            fontSize: 16,
            margin: [10, 10, 10, 10],
          },
          {
            text: `${rideDetails.Coupon.title}`,
            alignment: 'left',
            fontSize: 15,
            margin: [10, 10, 10, 10],
          },
          {
            text: `${rideDetails.Coupon.subTitle}`,
            alignment: 'left',
            fontSize: 15,
            margin: [10, 10, 10, 10],
          },
          {
            columns: [
              { text: 'Coupon Amount', alignment: 'left', fontSize: 16 },
              {
                text: `$ ${couponAmount}`,
                color: 'red',
                alignment: 'right',
                fontSize: 16,
              },
            ],
            margin: [10, 10, 10, 10],
          },
        ],
      };
    }
    const docDefinition: TDocumentDefinitions = {
      pageSize: 'A4',
      pageMargins: [40, 60, 40, 60],

      header: {
        columns: [
          {
            image: logoImage,
            width: 145,
          },
          {
            stack: [
              { text: `Ride Details\n`, bold: true, fontSize: 12 },
              { text: `${formattedDate} ${formattedTime}\n`, bold: true, fontSize: 12 },
            ],
            alignment: 'right',
          },
        ],
        margin: [20, 15, 30, 25],
      },

      content: [
        {
          columns: [
            {
              width: 6,
              canvas: [
                {
                  type: 'line',
                  x1: 0,
                  y1: 0,
                  x2: 550,
                  y2: 0,
                  lineWidth: 2,
                  lineColor: '#CCCCCC',
                },
              ],
              margin: [-12, 10, 20, 10],
            },
            {
              stack: [
                {
                  text: `Thanks for riding, ${passengerName}\n`,
                  margin: [10, 25, 25, 10],
                  marginTop: '10px',
                  fontSize: 28,
                  alignment: 'left',
                },
                {
                  text: `We hope you enjoyed your ride today\n`,
                  fontSize: 17,
                  margin: [10, 15, 25, 10],
                },
              ],
            },
            {
              stack: [
                {
                  canvas: [
                    {
                      type: 'rect',
                      x: 15,
                      y: 12,
                      w: 230,
                      h: 220,
                      color: '#616161',
                    },
                  ],
                },
                {
                  // White image overlayed on black background
                  image: vehicleImage,
                  width: 200,
                  absolutePosition: { x: 400, y: 90 }, // Adjust as necessary to align the image on top of the black background
                },
              ],
              alignment: 'right',
              margin: [10, 10, 10, 10],
            },
          ],
        },
        {
          columns: [
            { text: 'Total', alignment: 'left', fontSize: 26 },
            {
              text: `$ ${finalAmount}`,
              color: 'green',
              alignment: 'right',
              fontSize: 26,
            },
          ],
          margin: [10, 10, 10, 10],
        },
        {
          columns: [
            { text: 'Base Fare', alignment: 'left', fontSize: 17 },
            {
              text: `$ ${fare}`,
              alignment: 'right',
              fontSize: 17,
            },
          ],
          margin: [10, 10, 10, 10],
        },
        {
          columns: [
            { text: 'Distance', alignment: 'left', fontSize: 17 },
            {
              text: `${distanceInkm} km`,
              alignment: 'right',
              fontSize: 17,
            },
          ],
          margin: [10, 10, 10, 10],
        },
        {
          columns: [
            { text: 'Ride Duration', alignment: 'left', fontSize: 17 },
            {
              text: `${
                rideDetails.durationInmins >= 60
                  ? moment
                      .utc(moment.duration(rideDetails.durationInmins, 'minutes').asMilliseconds())
                      .format('H [hr], m [min]')
                  : moment
                      .utc(moment.duration(rideDetails.durationInmins, 'minutes').asMilliseconds())
                      .format('m [min]')
              }`,
              alignment: 'right',
              fontSize: 17,
            },
          ],
          margin: [10, 10, 10, 10],
        },
        {
          columns: [
            { text: 'Tip', alignment: 'left', fontSize: 17 },
            {
              text: `$ ${driversTip}`,
              alignment: 'right',
              fontSize: 17,
            },
          ],
          margin: [10, 10, 10, 10],
        },
        couponDetailsSection,
        { text: '', pageBreak: 'after' },
        {
          text: `You rode with ${driverName}`,
          margin: [10, 10, 10, 10],
          fontSize: 16,
        },
        {
          text: `This is not a payment receipt. It is a trip summary to acknowledge the completion of the trip. You will receive a trip receipt when the payment is processed with payment information.\n`,
          margin: [10, 10, 10, 10],
          fontSize: 11,
        },
        {
          text: `Drivers are critical to communities right now. Say thanks with a tip.`,
          margin: [10, 10, 10, 10],
          fontSize: 16,
        },
        {
          table: {
            body: [
              [
                {
                  text: 'Rate or Tip',
                  fontSize: 16,
                  color: 'white', // Text color
                  bold: true,
                  alignment: 'center',
                  link: 'https://customer.PiuPiu.com/profile',
                  fillColor: '#007bff',
                  margin: [10, 5, 10, 5],
                },
              ],
            ],
          },
          layout: {
            hLineWidth: function () {
              return 0;
            },
            vLineWidth: function () {
              return 0;
            },
          },
          width: 200,
          height: 30,
          margin: [10, 10, 10, 10],
        },
        {
          text: `When you ride with PiuPiu, your trips are insured in case of a covered accident.\n`,
          margin: [10, 10, 10, 10],
          fontSize: 16,
        },
        {
          text: 'Learn more >',
          fontSize: 16,
          color: 'blue',
          alignment: 'left',
          margin: [10, 10, 10, 10],
          link: 'https://www.PiuPiu.com/terms-and-condition/',
        },
        {
          columns: [
            { text: 'Origin Location', alignment: 'left', fontSize: 15 },
            {
              text: `${origin}`,
              alignment: 'right',
              color: 'blue',
              fontSize: 14,
            },
          ],
          margin: [10, 10, 10, 10],
        },
        {
          columns: [
            { text: 'Destination Location', alignment: 'left', fontSize: 15 },
            {
              text: `${destination}`,
              alignment: 'right',
              color: 'blue',
              fontSize: 14,
            },
          ],
          margin: [10, 10, 10, 10],
        },
        {
          columns: [
            {
              image: mapScreenshot,
              width: 145,
              alignment: 'right',
            },
          ],
          margin: [0, 10],
        },
      ],

      footer: (currentPage: number, pageCount: number) => {
        return {
          columns: [
            {
              width: 15,
              canvas: [
                {
                  type: 'line',
                  x1: 575,
                  y1: 0,
                  x2: 0,
                  y2: 0,
                  lineWidth: 4,
                  lineColor: '#CCCCCC',
                },
              ],
              margin: [10, -15, 0, 0],
            },
            {
              text: `${user.name}`,
              alignment: 'left',
              fontSize: 12,
              margin: [10, 0, 0, 0],
            },
            {
              text: `${currentPage} of ${pageCount}`,
              alignment: 'right',
              margin: [10, 0, 10, 0],
            },
          ] as any,
        };
      },
    };

    const pdfDoc = pdfMake.createPdf(docDefinition) as unknown as {
      getBuffer: (callback: (buffer: Buffer) => void) => void;
    };

    return new Promise<Buffer>((resolve, reject) => {
      pdfDoc.getBuffer((buffer) => {
        resolve(buffer);
      });
      pdfDoc.getBuffer((error) => {
        if (error) {
          reject(new Error('Error generating PDF buffer'));
        }
      });
    });
  } catch (error) {
    console.error('Error creating PDF:', error);
    throw error;
  }
}
