// Placeholder store data until the vendor API is wired.

export const vendorProducts = [
  { id: 1, name: "Wireless Earbuds Pro", price: "₦18,500", stock: 34, status: "Active", image: "https://images.unsplash.com/photo-1604632254231-004e0f122067?auto=format&fit=crop&w=240&q=80" },
  { id: 2, name: "Pulse Sport Earbuds", price: "₦15,750", stock: 5, status: "Active", image: "https://images.unsplash.com/photo-1607939506170-3971d016ba00?auto=format&fit=crop&w=240&q=80" },
  { id: 3, name: "Studio Headphones", price: "₦41,000", stock: 17, status: "Active", image: "https://images.unsplash.com/photo-1615182786845-37b226f0aa98?auto=format&fit=crop&w=240&q=80" },
  { id: 4, name: "Pods Mini", price: "₦13,500", stock: 3, status: "Active", image: "https://images.unsplash.com/photo-1542163276-2620fe05e7b5?auto=format&fit=crop&w=240&q=80" },
  { id: 5, name: "Commute Headphones", price: "₦32,000", stock: 0, status: "Draft", image: "https://images.unsplash.com/photo-1679685803410-21bb52ccf6ee?auto=format&fit=crop&w=240&q=80" },
];

export const vendorOrders = [
  { id: "HM-2148", customer: "Tolu Adeyemi", status: "Processing", total: "₦37,000" },
  { id: "HM-2144", customer: "Chidi Eze", status: "Pending", total: "₦18,500" },
  { id: "HM-2139", customer: "Zainab Bello", status: "Shipped", total: "₦62,000" },
  { id: "HM-2132", customer: "Kunle Martins", status: "Delivered", total: "₦15,750" },
  { id: "HM-2127", customer: "Nneka Okoro", status: "Delivered", total: "₦41,000" },
];

export const vendorReviews = [
  { text: "Excellent sound and quick delivery.", rating: "5.0" },
  { text: "Secure fit and solid battery life.", rating: "4.0" },
  { text: "Clean, balanced audio. Worth every naira.", rating: "5.0" },
];
