export interface Store {
  name: string;
  description: string;
  banner: string;
  profile_photo: string;
  instagram: string;
  whatsApp: string;
  address: string;
  business_hours: string;
  email: string;
  password: string;
}

export interface MulterFiles {
  banner?: Express.Multer.File[];
  profile_photo?: Express.Multer.File[];
}


