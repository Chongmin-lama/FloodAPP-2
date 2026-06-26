export const Field = ({
  label,
  name,
  placeholder,
  defaultValue,
  required,
}: {
  label: string;
  name: string;
  placeholder?: string;
  defaultValue?: string;
  required?: boolean;
}) => {
  return (
    <label className="grid gap-2 text-sm font-semibold text-slate-700">
      {label}
      <input
        name={name}
        placeholder={placeholder}
        defaultValue={defaultValue}
        required={required}
        className="rounded-md border border-slate-300 px-3 py-2 text-sm font-normal outline-none focus:border-flood-teal focus:ring-2 focus:ring-teal-100"
      />
    </label>
  );
};

export const Select = ({
  label,
  name,
  options,
}: {
  label: string;
  name: string;
  options: string[];
}) => {
  return (
    <label className="grid gap-2 text-sm font-semibold text-slate-700">
      {label}
      <select
        name={name}
        className="rounded-md border border-slate-300 px-3 py-2 text-sm font-normal outline-none focus:border-flood-teal focus:ring-2 focus:ring-teal-100"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
};

export const nepalDistricts = [
  // Province 1 (Koshi)
  "Taplejung",
  "Panchthar",
  "Ilam",
  "Jhapa",
  "Morang",
  "Sunsari",
  "Dhankuta",
  "Terhathum",
  "Sankhuwasabha",
  "Bhojpur",
  "Solukhumbu",
  "Okhaldhunga",
  "Khotang",
  "Udayapur",

  // Province 2 (Madhesh)
  "Saptari",
  "Siraha",
  "Dhanusha",
  "Mahottari",
  "Sarlahi",
  "Rautahat",
  "Bara",
  "Parsa",

  // Bagmati Province
  "Sindhupalchok",
  "Rasuwa",
  "Nuwakot",
  "Dhading",
  "Kathmandu",
  "Bhaktapur",
  "Lalitpur",
  "Kavrepalanchok",
  "Sindhuli",
  "Ramechhap",
  "Dolakha",
  "Makwanpur",
  "Chitwan",

  // Gandaki Province
  "Gorkha",
  "Manang",
  "Mustang",
  "Myagdi",
  "Kaski",
  "Lamjung",
  "Tanahu",
  "Nawalpur",
  "Syangja",
  "Parbat",
  "Baglung",

  // Lumbini Province
  "Rukum East",
  "Rolpa",
  "Pyuthan",
  "Gulmi",
  "Arghakhanchi",
  "Palpa",
  "Nawalparasi East",
  "Rupandehi",
  "Kapilvastu",
  "Dang",
  "Banke",
  "Bardiya",

  // Karnali Province
  "Dolpa",
  "Mugu",
  "Humla",
  "Jumla",
  "Kalikot",
  "Dailekh",
  "Jajarkot",
  "Rukum West",
  "Salyan",
  "Surkhet",

  // Sudurpashchim Province
  "Bajura",
  "Bajhang",
  "Achham",
  "Doti",
  "Kailali",
  "Kanchanpur",
  "Dadeldhura",
  "Baitadi",
  "Darchula",
];
