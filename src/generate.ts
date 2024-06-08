import axios from 'axios';
import dotenv from 'dotenv';
import figmaApiExporter from 'figma-api-exporter';
import path from 'path';

dotenv.config();

const FIGMA_ACCESS_TOKEN = process.env.FIGMA_ACCESS_TOKEN as string;
const FIGMA_FILE_ID = process.env.FIGMA_FILE_ID;
const FIGMA_CANVAS = process.env.FIGMA_CANVAS;

const BASE__FILE_URL = `https://api.figma.com/v1/files/${FIGMA_FILE_ID}/nodes`;
const ICON_BASE_URL = `https://api.figma.com/v1/images/${FIGMA_FILE_ID}`;

const ICONS_DIRECTORY_PATH = path.resolve(__dirname, './icons/components');
const SVG_DIRECTORY_PATH = path.resolve(__dirname, './icons/svgs');
const INDEX_DIRECTORY_PATH = path.resolve(__dirname, './icons');

const queryParams = {
  ids: '21-23',
};

const imageQueryParams = {
  format: 'svg',
};

const headers = {
  // 'Authorization': 'Bearer YOUR_ACCESS_TOKEN',
  // 'Content-Type': 'application/json', // Adjust content type based on your needs
  'X-Figma-Token': FIGMA_ACCESS_TOKEN,
};

const makeApiCall = async () => {
  try {
    const response = await axios
      .get(BASE__FILE_URL, {
        headers,
        params: queryParams,
      })

      const childrenDataArray: { name: string; id: string }[] = [];
      const childrenData = response.data.nodes['21:23'].document.children;

      childrenData.forEach((child: any) => {
        childrenDataArray.push({ name: child.name, id: child.id });
      });

      return childrenDataArray;
  } catch (error) {
    console.log('ERR', error);
    throw error;
  }
};

const downloadSVGsData = async <T extends {}>(
  data: ({ url: string } & T)[]
) => {
  return Promise.all(
    data.map(async (dataItem) => {
      const downloadedSvg = await axios.get<string>(dataItem.url);
      return {
        ...dataItem,
        data: downloadedSvg.data,
      };
    })
  );
};

const getImageUrl = async () => {
  const data = await makeApiCall();
  console.log('DATA:', data);

  // let dataResponse : any = []

  // let resData : any = []

  // data.forEach((child: any) => {
  //   const encodedId = encodeURIComponent(child.id);
  //   const url = `${ICON_BASE_URL}?ids=${encodedId}&format=svg`;
    
  //   axios
  //     .get(url, {
  //       headers,
  //     })
  //     .then((response) => {
  //       // dataResponse = [...dataResponse, response.data.images[child.id]] 
  //       console.log('res 1', response.data)
  //       return axios.get(response.data.images[child.id]).then((res) => {
  //         resData = [...resData, res]
  //         console.log('res 2', res.data)
  //       return res.data
  //         // svgData = [...svgData, res.data]
  //         // console.log('Downloaded RES:', res.data);
  //         // return {
  //         //   ...child,
  //         //   data: res.data,
  //         // };
  //       });

  //       // return downloadSVGsData(response)
  //     })
  //     .catch((err) => {
  //       console.log('ERR', err);
  //     });
  // });
  // console.log('resData', resData)
};


const result = getImageUrl();
