import Layout from './components/Layout';
import AccountList from './components/AccountList';

export default function Home() {
  return (
    <Layout>
      <div className="py-4">
        <AccountList />
      </div>
    </Layout>
  );
}
