import { Model } from 'sequelize';
export interface IBlogs {
    id: number;
    image: string;
    title: string;
    author: string;
    author_image: string;
    subtitle: string;
    description: string;
    status: 'active' | 'inactive';
}
declare class Blogs extends Model<IBlogs> implements IBlogs {
    id: number;
    image: string;
    title: string;
    author: string;
    author_image: string;
    subtitle: string;
    description: string;
    status: 'active' | 'inactive';
}
export default Blogs;
