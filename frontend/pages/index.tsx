import { GetServerSideProps } from 'next';
import Dashboard from './dashboard';

export default function Home() {
  return <Dashboard />;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {}, // will be passed to the page component as props
  };
};
