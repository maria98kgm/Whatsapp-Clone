const SignIn = () => {
  return (
    <div>
      <h2 className="text-4xl mb-8">Sign In</h2>
      <div className="flex flex-col gap-5">
        <label>
          <p className="text-left pb-2 text-lg pl-1">idInstance</p>
          <input type="text" className="text-input" />
        </label>
        <label>
          <p className="text-left pb-2 text-lg pl-1">apiTokenInstance</p>
          <input type="text" className="text-input" />
        </label>
      </div>
    </div>
  );
};

export default SignIn;
