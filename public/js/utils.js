export function extractParams(){
    const search = window.location.search;
    const slen = search.length;
    if(slen === 0) return [];
    const params = search.substr(1,slen -1).split("&");
    const paramsObj = {};
    for(const param of params){
        const [ key, val ] = param.split("=");
        paramsObj[key] = val;
    }
    return paramsObj;
}

export function fileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  }
  
export function exportPaintingToBase64(painting, options = {}) {
    const { width, height, type, quality } = options;
    const sWidth = painting.naturalWidth ?? painting.width;
    const sHeight = painting.naturalHeight ?? painting.height;
    const offcnv = window.document.createElement("canvas");
    offcnv.width = width ?? sWidth;
    offcnv.height = height ?? sHeight;
    const offc = offcnv.getContext("2d");
    const cWidth = width ?? sWidth;
    const cHeight = height ?? sHeight;
    offc.drawImage(painting, 0, 0, sWidth, sHeight, 0, 0, cWidth, cHeight);
    const contentType = type || "image/png";
    const contentQuality = quality ?? 0.92;
    return offcnv.toDataURL(contentType, contentQuality);
  }

export function exportPaintingToBlob(painting/*canvas or image*/, options = {}) {
    const { width, height, type, quality } = options;
    const sWidth = painting.naturalWidth ?? painting.width;
    const sHeight = painting.naturalHeight ?? painting.height;
    const offcnv = window.document.createElement("canvas");
    offcnv.width = width ?? sWidth;
    offcnv.height = height ?? sHeight;
    const offc = offcnv.getContext("2d");
    const cWidth = width ?? sWidth;
    const cHeight = height ?? sHeight;
    offc.drawImage(painting, 0, 0, sWidth, sHeight, 0, 0, cWidth, cHeight);
    const contentType = type || "image/png";
    const contentQuality = quality ?? 0.92;
    return new Promise((resolve, reject) => {
        offcnv.toBlob((blob) => {
            resolve(blob);
        }, contentType, contentQuality);
    });
}

export function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }