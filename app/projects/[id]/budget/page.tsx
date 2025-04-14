'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import Button from '@/app/components/Button';

interface BudgetItem {
  category: string;
  description: string;
  amount: number;
  status: string;
  date: string;
}

interface BudgetSummary {
  total_planned: number;
  total_approved: number;
  total_spent: number;
}

interface Budget {
  items: BudgetItem[];
  summary: BudgetSummary;
}

const CATEGORIES = [
  '演职人员',
  '设备',
  '场地',
  '道具和服装',
  '餐饮',
  '交通',
  '后期制作',
];

const STATUS_OPTIONS = [
  { value: 'planned', label: '计划中', color: 'text-gray-600' },
  { value: 'approved', label: '已批准', color: 'text-blue-600' },
  { value: 'spent', label: '已支出', color: 'text-green-600' },
];

export default function BudgetPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [budget, setBudget] = useState<Budget | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedItems, setEditedItems] = useState<BudgetItem[]>([]);
  const [newItem, setNewItem] = useState<BudgetItem>({
    category: CATEGORIES[0],
    description: '',
    amount: 0,
    status: 'planned',
    date: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    const fetchBudget = async () => {
      try {
        const response = await fetch(`/api/projects/${params.id}/budget`);
        if (!response.ok) {
          throw new Error('获取预算信息失败');
        }
        const data = await response.json();
        setBudget(data);
        setEditedItems(data.items);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : '加载预算时出错');
        setLoading(false);
      }
    };

    fetchBudget();
  }, [params.id]);

  const handleSave = async () => {
    try {
      const response = await fetch(`/api/projects/${params.id}/budget`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ items: editedItems }),
      });

      if (!response.ok) {
        throw new Error('更新预算失败');
      }

      const updatedBudget = await response.json();
      setBudget(updatedBudget);
      setIsEditing(false);
      toast.success('预算已更新');
    } catch (error) {
      console.error('Error updating budget:', error);
      toast.error('更新预算失败');
    }
  };

  const handleAddItem = () => {
    if (!newItem.description || newItem.amount <= 0) {
      toast.error('请填写所有必填字段');
      return;
    }
    setEditedItems([...editedItems, newItem]);
    setNewItem({
      category: CATEGORIES[0],
      description: '',
      amount: 0,
      status: 'planned',
      date: new Date().toISOString().split('T')[0],
    });
  };

  const handleItemChange = (index: number, field: keyof BudgetItem, value: any) => {
    const updatedItems = [...editedItems];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    setEditedItems(updatedItems);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">{error}</div>
      </div>
    );
  }

  if (!budget) return null;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">预算管理</h1>
        <div className="space-x-4">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                取消
              </Button>
              <Button onClick={handleSave}>保存</Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)}>编辑预算</Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">计划总额</h3>
            <span className="text-2xl font-bold text-gray-600">
              ¥{budget.summary.total_planned.toFixed(2)}
            </span>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">已批准总额</h3>
            <span className="text-2xl font-bold text-blue-600">
              ¥{budget.summary.total_approved.toFixed(2)}
            </span>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">已支出总额</h3>
            <span className="text-2xl font-bold text-green-600">
              ¥{budget.summary.total_spent.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6">
          <h2 className="text-lg font-semibold mb-4">预算明细</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    类别
                  </th>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    描述
                  </th>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    金额
                  </th>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    状态
                  </th>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    日期
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {editedItems.map((item, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {isEditing ? (
                        <select
                          value={item.category}
                          onChange={(e) => handleItemChange(index, 'category', e.target.value)}
                          className="w-full p-2 border rounded"
                        >
                          {CATEGORIES.map((category) => (
                            <option key={category} value={category}>
                              {category}
                            </option>
                          ))}
                        </select>
                      ) : (
                        item.category
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {isEditing ? (
                        <input
                          type="text"
                          value={item.description}
                          onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                          className="w-full p-2 border rounded"
                        />
                      ) : (
                        item.description
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {isEditing ? (
                        <input
                          type="number"
                          value={item.amount}
                          onChange={(e) => handleItemChange(index, 'amount', parseFloat(e.target.value))}
                          className="w-full p-2 border rounded"
                          min="0"
                          step="0.01"
                        />
                      ) : (
                        `¥${item.amount.toFixed(2)}`
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {isEditing ? (
                        <select
                          value={item.status}
                          onChange={(e) => handleItemChange(index, 'status', e.target.value)}
                          className="w-full p-2 border rounded"
                        >
                          {STATUS_OPTIONS.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <span className={STATUS_OPTIONS.find(opt => opt.value === item.status)?.color}>
                          {STATUS_OPTIONS.find(opt => opt.value === item.status)?.label}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {isEditing ? (
                        <input
                          type="date"
                          value={item.date}
                          onChange={(e) => handleItemChange(index, 'date', e.target.value)}
                          className="w-full p-2 border rounded"
                        />
                      ) : (
                        new Date(item.date).toLocaleDateString()
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {isEditing && (
            <div className="mt-6 grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  类别
                </label>
                <select
                  value={newItem.category}
                  onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                  className="w-full p-2 border rounded"
                >
                  {CATEGORIES.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  描述
                </label>
                <input
                  type="text"
                  value={newItem.description}
                  onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                  className="w-full p-2 border rounded"
                  placeholder="输入描述"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  金额
                </label>
                <input
                  type="number"
                  value={newItem.amount}
                  onChange={(e) => setNewItem({ ...newItem, amount: parseFloat(e.target.value) })}
                  className="w-full p-2 border rounded"
                  min="0"
                  step="0.01"
                  placeholder="输入金额"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  日期
                </label>
                <input
                  type="date"
                  value={newItem.date}
                  onChange={(e) => setNewItem({ ...newItem, date: e.target.value })}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <Button onClick={handleAddItem} className="w-full">
                  添加项目
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 